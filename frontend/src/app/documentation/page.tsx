"use client";

import { useState, useEffect } from "react";
import { formatDate, getApiErrorMessage } from "../../../SharedFunctions";
import { DocumentType, DocumentInputType } from "../../../Interfaces";
import { useAuth } from "../../../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { DocServices } from "../../../services/apiServices/DocService";

interface FilterByType {
  title: string;
  date: Date | undefined;
}
export interface filterByPayloadType {
  Title: string;
  Date: string;
}

export default function Page() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"list" | "form" | "both">("both");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [validate, setValidate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [Searching, setSearching] = useState<boolean>(false);
  const [docId, setDocId] = useState<string>("");
  const [match, setMatch] = useState<string>("");
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [isFeedBack, setIsFeedBack] = useState<boolean>();
  const [query, setQuery] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [btnText, setBtnText] = useState<string>("Create");
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentType[]>(
    []
  );
  const [feedbackText, setFeedbackText] = useState<string | undefined>(
    undefined
  );
  const [content, setContent] = useState<DocumentInputType>({
    id: "",
    title: "",
    body: "",
  });
  const [filterBy, setFilterBy] = useState<FilterByType>({
    title: "",
    date: undefined,
  });

  // functions
  const mapPayload = () => {
    const payload: filterByPayloadType = {
      Date: filterBy.date ? filterBy.date?.toISOString() : "",
      Title: filterBy.title ?? "",
    };
    return payload;
  };

  const validateFilterByForm = (): boolean => {
    const payload = mapPayload();

    if (!payload.Date && !payload.Title) {
      return false;
    }

    return true;
  };

  const matchFilterType = (payload: filterByPayloadType) => {
    const matchParts: string[] = [];

    if (payload.Title) {
      matchParts.push(payload.Title);
    }

    if (payload.Date) {
      matchParts.push(payload.Date.split("T")[0]);
    }

    setMatch(matchParts.join(" & "));
  };
  const handleFilterBy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      setQuery("");
    }

    if (!validateFilterByForm()) {
      setIsFeedBack(true);
      setFeedbackText("Please provide a title or date to filter.");
      return;
    }

    const payload = mapPayload();
    matchFilterType(payload);

    setSearching(true);
    try {
      const docs = await DocServices.filter(payload);
      setFilteredDocuments(docs);
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(err);
      setFeedbackText(errorMsg);
    } finally {
      setSearching(false);
    }
  };

  const resetFilterBy = () => {
    setFilterBy({ title: "", date: undefined });
    setFilteredDocuments(documents);
  };

  const setMode = (doc: DocumentType, isReadonly: boolean) => {
    setContent({
      id: doc.id,
      title: doc.title,
      body: doc.content,
    });

    if (viewMode === "list") {
      setViewMode("form");
      localStorage.setItem("showDocuForm", "true");
    }

    if (isReadonly) {
      localStorage.setItem("isReadonly", "true");
    } else {
      setBtnText("Update");
      localStorage.removeItem("isReadonly");
    }

    setIsReadOnly(isReadonly);
  };

  const readDocument = (id: string): void => {
    const document: DocumentType | undefined = documents.find(
      (d) => d.id === id
    );
    if (document) {
      setMode(document, true);
    } else {
      console.error(`Document with ID ${id} not found.`);
    }
  };

  const editDocument = (id: string) => {
    const document: DocumentType | undefined = documents.find(
      (d) => d.id === id
    );
    if (document) {
      setMode(document, false);
    } else console.log(`${document} not found `);
  };

  const deleteIsSuccess = (id: string, docs: DocumentType[]) => {
    setDocuments(docs);
    setFilteredDocuments(docs);
    setIsFeedBack(!isFeedBack);
    setFeedbackText("Dcument deleted Successfully.");

    if (id === content.id) {
      setContent({ title: "", body: "", id: "" });
    }
  };

  const deleteDocument = async (id: string) => {
    setSearching(true);
    try {
      const docs = await DocServices.delete(id);
      deleteIsSuccess(id, docs);
    } catch (err) {
      console.error(err);
      setIsFeedBack(!isFeedBack);
      setFeedbackText("Server error, Fail to delete document");
    } finally {
      setSearching(false);
    }
  };

  const handleResize = () => {
    const valueFromStorage = localStorage.getItem("showDocuForm");
    const w = window.innerWidth;

    if (w >= 815) {
      setViewMode("both");
    } else if (w < 815 && valueFromStorage === null) {
      setViewMode("list");
    } else if (w < 815 && valueFromStorage === "true") {
      setViewMode("form");
    } else console.log("handle resize is confused");
  };

  const draftingInput = () => {
    const darft = localStorage.getItem("inputContent");

    if (darft) {
      const draftData = JSON.parse(darft) as DocumentInputType;

      // Consolidate the content setting
      setContent({
        id: draftData.id ?? "",
        title: draftData.title ?? "",
        body: draftData.body ?? "",
      });

      const isReadOnlyFromStorage =
        localStorage.getItem("isReadonly") === "true";

      if (draftData.id) {
        // If a document ID exists, determine the correct mode (read-only or update)
        if (isReadOnlyFromStorage) {
          setIsReadOnly(true);
        } else {
          setIsReadOnly(false);
          setBtnText("Update");
        }
      } else {
        // If no document ID exists, it's a new document
        setIsReadOnly(false);
        setBtnText("Create");
      }
    }
  };

  const getAllDocuments = async () => {
    setIsLoading(true);

    try {
      const docs = await DocServices.getDocs();
      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setSearching(false);
      setIsLoading(false);
    }
  };

  const validateCreateDocForm = (): boolean => {
    if (content.body.length < 2 && content.title.length < 2) {
      return false;
    }
    return true;
  };

  const apiIsSuccess = (docs: DocumentType[], method: "create" | "update") => {
    setDocuments(docs);
    setFilteredDocuments(docs);
    setContent({ title: "", body: "", id: "" });
    setIsFeedBack(!isFeedBack);

    if (method == "update") {
      setBtnText("Create");
      setFeedbackText("Document has been updated.");
    } else {
      setFeedbackText("Document has been created.");
    }
  };

  const mapCreatePayload = () => {
    const payload = {
      Title: content.title,
      Body: content.body,
    };
    return payload;
  };

  const createDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateCreateDocForm()) {
      setIsFeedBack(!isFeedBack);
      setFeedbackText(
        "Title or content body can't contain less that two characters"
      );
      return;
    }

    const payload = mapCreatePayload();
    setIsLoading(true);

    try {
      const docs = await DocServices.create(payload);
      apiIsSuccess(docs, "create");
    } catch (err: unknown) {
      console.error(err);
      setIsFeedBack(!isFeedBack);
      setFeedbackText("Failed to create document");
    } finally {
      setIsLoading(false);
    }
  };

  const validateUpdateDocForm = (): string | null => {
    if (content.body === "" && content.title === "")
      return "Document content can't be empty.";

    if (content.body.length < 2 && content.title.length < 2)
      return "Title or content body of Document can't contain less that two characters.";

    if (content.id === "") return "Document id is missing, try again";

    return null;
  };

  const updateDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateUpdateDocForm();

    if (validationError) {
      setIsFeedBack(!isFeedBack);
      setFeedbackText(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const docs = await DocServices.update({
        Title: content.title,
        Body: content.body,
        DocumentIdStr: content.id,
      });
      apiIsSuccess(docs, "update");
    } catch (err: unknown) {
      console.error(err);
      setIsFeedBack(!isFeedBack);
      setFeedbackText("Fail to update.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentsByTitle = async () => {
    if (query.trim() === "") {
      setSearching(false);
      return;
    }

    try {
      const docs = await DocServices.filterDocByTitle(query);
      setFilteredDocuments(docs);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setMatch(query);
      setSearching(false);
    }
  };


  // USE EFFECTS
  useEffect(() => {
    handleResize();
    draftingInput();
    getAllDocuments();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem("inputContent", JSON.stringify(content));
    }, 300);
  }, [content]);

  useEffect(() => {
    if (documents.length < 1) return;

      const validateQuery = () => {
        if (query.trim() === "") {
          setFilteredDocuments(documents);
          setSearching(false);
          return;
        }
      };

      const modifyUIBeforeFiltering = () => {
        setFilterBy({ title: "", date: undefined });
        setShowFilter(false);
        if (viewMode !== "list" && viewMode !== "both") {
          setViewMode("list");
          localStorage.removeItem("showDocuForm");
        }
      };

      const filterDocByTitle = () => {
        const filtered: DocumentType[] = documents.filter((docs) =>
          docs.title.toLowerCase().includes(query.toLowerCase())
        );
        setMatch(query);
        setFilteredDocuments(filtered);
        setSearching(false);
      };

    setSearching(true);
    const handler = setTimeout(() => {
      validateQuery();
      modifyUIBeforeFiltering();
      filterDocByTitle();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, documents, viewMode, documents.length]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <>
      {isLoading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
          style={{ cursor: "not-allowed" }}
        >
          <LoadingSpinner
            styles={{ svg: " h-10 w-10", span: "text-[1.2rem]" }}
            text="Loading..."
          />
        </div>
      )}
      <header
        className={`flex ${
          documents.length > 0 ? "justify-between" :  `${viewMode !== "list" ? 'gap-[15%]' : 'gap-[5%]'}`
        }  items-center px-2 sm:px-6 mt-5 lmd:mt-4 -mb-2 border-b-2 border-dashed border-gray-500 pb-4`}
      >
        <div className="py-[0.5rem] px-4 text-sm md:text-lg bg-black text-white rounded-md cursor-pointer">
          Document
        </div>

        <div
          className={`${
            viewMode !== "list" ? "w-[50%]" : "w-[40%]"
          }  lg:w-[45%] flex items-center justify-between  border border-gray-600 rounded-3xl overflow-hidden`}
        >
          {query && (
            <div
              className="border-r-2 w-[15%] md:w-[13.5%] lmd:w-[10%] py-2 cursor-pointer"
              onClick={() => setQuery("")}
            >
              <svg
                className="w-5 lmd:w-7 mx-auto"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="cancel">
                    <g id="cancel_2">
                      <path
                        id="Combined Shape"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M36.3291 10.2931L29.0251 17.5971C28.9938 17.6284 28.961 17.6571 28.9269 17.6834C28.9002 17.7181 28.871 17.7515 28.8393 17.7833L25.4403 21.1822L26.8539 22.5958L37.7428 11.7069C38.1342 11.3156 38.1342 10.6834 37.7419 10.2922C37.3527 9.90193 36.7192 9.90193 36.3291 10.2931ZM28.2682 24.01L39.1571 13.1211C40.3297 11.9484 40.3297 10.0486 39.1562 8.87798C37.9872 7.70606 36.0847 7.70606 34.9139 8.87979L27.6108 16.1829C27.5791 16.2147 27.5499 16.2481 27.5232 16.2828C27.4891 16.3091 27.4563 16.3378 27.425 16.3691L24.0261 19.768L23.3883 19.1301C23.3784 19.1202 23.3684 19.1107 23.3583 19.1013L13.1527 8.89569C11.9828 7.72286 10.0803 7.72286 8.90954 8.89659C7.74007 10.0691 7.74007 11.9675 8.91044 13.1379L19.7833 24.0108L8.92904 34.8651C8.80498 34.9853 8.63403 35.1885 8.46649 35.4607C7.76939 36.5931 7.76653 37.9264 8.92154 39.0798C10.0972 40.2298 11.4174 40.2314 12.5531 39.5674C12.8256 39.408 13.0302 39.2449 13.1621 39.1163L21.9373 30.3413C22.3278 29.9508 22.3278 29.3176 21.9373 28.9271C21.5467 28.5366 20.9136 28.5366 20.523 28.9271L11.757 37.6931C11.7422 37.7074 11.6609 37.7722 11.5436 37.8408C11.1166 38.0905 10.7697 38.0901 10.351 37.6807C9.91539 37.2458 9.91609 36.921 10.1697 36.5091C10.2407 36.3938 10.3083 36.3134 10.3326 36.2898L24.0261 22.5964L25.4397 24.01L23.4948 25.9549C23.3637 26.086 23.2766 26.2445 23.2335 26.412C23.0117 26.7946 23.0645 27.2928 23.392 27.6203L34.908 39.1363C36.0806 40.3088 37.9797 40.3088 39.1523 39.1363C40.3226 37.9629 40.3226 36.0645 39.1523 34.8941L28.2682 24.01ZM26.8539 25.4242L25.4392 26.839L36.3223 37.7221C36.7137 38.1136 37.3466 38.1136 37.7371 37.723C38.1277 37.3315 38.1277 36.6979 37.738 36.3083L26.8539 25.4242ZM22.6113 21.1828L21.1975 22.5966L10.3247 11.7237C9.93503 11.3341 9.93503 10.7005 10.3256 10.309C10.7148 9.91873 11.3483 9.91873 11.7375 10.309L22.6113 21.1828Z"
                        fill="#000"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          )}
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-[77.5%] bg-inherit py-2 outline-none pl-3 pr-1 lmd:pl-5 text-sm sm:text-[0.92rem] md:text-[1rem]"
          />

          <div
            className="bg-gray-700 hover:bg-black w-[18%] md:w-[15%] lmd:w-[12.5%] py-2 cursor-pointer "
            onClick={getDocumentsByTitle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") getDocumentsByTitle();
            }}
          >
            <svg
              className="w-5 lmd:w-7 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g clipPath="url(#clip0_15_152)">
                  <circle
                    cx="10.5"
                    cy="10.5"
                    r="6.5"
                    stroke="#fff"
                    strokeLinejoin="round"
                  ></circle>
                  <path
                    d="M19.6464 20.3536C19.8417 20.5488 20.1583 20.5488 20.3536 20.3536C20.5488 20.1583 20.5488 19.8417 20.3536 19.6464L19.6464 20.3536ZM20.3536 19.6464L15.3536 14.6464L14.6464 15.3536L19.6464 20.3536L20.3536 19.6464Z"
                    fill="#fff"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_15_152">
                    <rect width="24" height="24" fill="white"></rect>
                  </clipPath>
                </defs>
              </g>
            </svg>
          </div>
        </div>

        {(viewMode === "list" || viewMode === "both") && (
          <div
            onClick={() => setShowFilter(true)}
            className=" border text-sm border-gray-600 rounded-md py-2 px-4 flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white stroke-black hover:stroke-white"
          >
            <svg
              className="w-4"
              viewBox="-0.5 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M22 3.58002H2C1.99912 5.28492 2.43416 6.96173 3.26376 8.45117C4.09337 9.94062 5.29 11.1932 6.73999 12.09C7.44033 12.5379 8.01525 13.1565 8.41062 13.8877C8.80598 14.6189 9.00879 15.4388 9 16.27V21.54L15 20.54V16.25C14.9912 15.4188 15.194 14.599 15.5894 13.8677C15.9847 13.1365 16.5597 12.5178 17.26 12.07C18.7071 11.175 19.9019 9.92554 20.7314 8.43988C21.5608 6.95422 21.9975 5.28153 22 3.58002Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            Filter
          </div>
        )}

        {showFilter && (
          <div className="flex items-center gap-3 relative">
            <div className=" bg-black w-[15rem] text-white py-4 px-5 absolute -top-10 right-1 z-10 rounded-xl border border-gray-600">
              <div>
                <svg
                  className="w-5 ml-auto text-righ cursor-pointer"
                  onClick={() => {
                    setShowFilter(false);
                  }}
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g id="cancel">
                      <g id="cancel_2">
                        <path
                          id="Combined Shape"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M36.3291 10.2931L29.0251 17.5971C28.9938 17.6284 28.961 17.6571 28.9269 17.6834C28.9002 17.7181 28.871 17.7515 28.8393 17.7833L25.4403 21.1822L26.8539 22.5958L37.7428 11.7069C38.1342 11.3156 38.1342 10.6834 37.7419 10.2922C37.3527 9.90193 36.7192 9.90193 36.3291 10.2931ZM28.2682 24.01L39.1571 13.1211C40.3297 11.9484 40.3297 10.0486 39.1562 8.87798C37.9872 7.70606 36.0847 7.70606 34.9139 8.87979L27.6108 16.1829C27.5791 16.2147 27.5499 16.2481 27.5232 16.2828C27.4891 16.3091 27.4563 16.3378 27.425 16.3691L24.0261 19.768L23.3883 19.1301C23.3784 19.1202 23.3684 19.1107 23.3583 19.1013L13.1527 8.89569C11.9828 7.72286 10.0803 7.72286 8.90954 8.89659C7.74007 10.0691 7.74007 11.9675 8.91044 13.1379L19.7833 24.0108L8.92904 34.8651C8.80498 34.9853 8.63403 35.1885 8.46649 35.4607C7.76939 36.5931 7.76653 37.9264 8.92154 39.0798C10.0972 40.2298 11.4174 40.2314 12.5531 39.5674C12.8256 39.408 13.0302 39.2449 13.1621 39.1163L21.9373 30.3413C22.3278 29.9508 22.3278 29.3176 21.9373 28.9271C21.5467 28.5366 20.9136 28.5366 20.523 28.9271L11.757 37.6931C11.7422 37.7074 11.6609 37.7722 11.5436 37.8408C11.1166 38.0905 10.7697 38.0901 10.351 37.6807C9.91539 37.2458 9.91609 36.921 10.1697 36.5091C10.2407 36.3938 10.3083 36.3134 10.3326 36.2898L24.0261 22.5964L25.4397 24.01L23.4948 25.9549C23.3637 26.086 23.2766 26.2445 23.2335 26.412C23.0117 26.7946 23.0645 27.2928 23.392 27.6203L34.908 39.1363C36.0806 40.3088 37.9797 40.3088 39.1523 39.1363C40.3226 37.9629 40.3226 36.0645 39.1523 34.8941L28.2682 24.01ZM26.8539 25.4242L25.4392 26.839L36.3223 37.7221C36.7137 38.1136 37.3466 38.1136 37.7371 37.723C38.1277 37.3315 38.1277 36.6979 37.738 36.3083L26.8539 25.4242ZM22.6113 21.1828L21.1975 22.5966L10.3247 11.7237C9.93503 11.3341 9.93503 10.7005 10.3256 10.309C10.7148 9.91873 11.3483 9.91873 11.7375 10.309L22.6113 21.1828Z"
                          fill="#fff"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <h1 className="border-b text-sm mb-4 w-fit pb-1">Filter by :</h1>

              <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={handleFilterBy}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") handleFilterBy(e);
                // }}
              >
                <div className={`flex flex-col text-sm w-[100%]`}>
                  <label className=" font-medium">Title</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Title"
                    value={filterBy.title}
                    onChange={(e) =>
                      setFilterBy({ ...filterBy, title: e.target.value })
                    }
                    className="border border-gray-600 text-black rounded-lg outline-none py-2 px-2 w-full"
                  />
                </div>

                <div className={`flex flex-col text-sm w-[100%]`}>
                  <label className=" font-medium">Date</label>
                  <input
                    id="deadline"
                    type="date"
                    value={
                      filterBy.date
                        ? filterBy.date.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFilterBy({
                        ...filterBy,
                        date: e.target.value
                          ? new Date(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="DD/MM/YYYY"
                    className="border border-gray-600 text-black rounded-lg outline-none py-2 px-2 w-full"
                  />
                </div>
                <div className="my-2 flex justify-between items-center">
                  <div
                    onClick={resetFilterBy}
                    className="py-2 px-4 rounded-md cursor-pointer text-sm text-black hover:text-white  bg-white hover:bg-black border"
                  >
                    <button type="button">Reset</button>
                  </div>
                  <div className="py-2 px-4 rounded-md cursor-pointer text-sm text-black hover:text-white  bg-white hover:bg-black border">
                    <button type="submit">Confirm</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      <main className="relative flex justify-between items-center flex-col gap-1 md:gap-2 md:flex-row h-[85%] pt-4 md:pt-5 pb-[3.6rem] sm:pb-0">
        {validate && (
          <div
            className={`px-6 bg-red-600 border w-[80%] h-fit py-10 flex flex-col gap-4 justify-center items-center rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
          >
            <p className=" text-center text-xl text-white font-mono font-semibold">
              Are you sure you want to delete this document?
            </p>
            <div className="w-[80%] flex justify-between items-center">
              <button
                className="bg-white text-black py-3 px-10 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
                onClick={() => {
                  setValidate(!validate);
                  deleteDocument(docId);
                }}
              >
                Yes
              </button>
              <button
                className="bg-white text-black py-3 px-10 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
                onClick={() => setValidate(!validate)}
              >
                No
              </button>
            </div>
          </div>
        )}
        {isFeedBack && (
          <div
            className={`w-[90%] md:w-[80%] lmd:w-[48%] bg-black border h-fit py-10 flex flex-col gap-4 justify-center items-center rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
          >
            <p className="text-center text-xl text-white font-mono font-semibold">
              {feedbackText}
            </p>
            <button
              className="bg-white text-black py-3 px-10 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
              onClick={() => {
                setIsFeedBack(!isFeedBack);
                if (feedbackText?.endsWith("Successfully")) {
                  setContent({ id: "", body: "", title: "" });
                }
              }}
            >
              Ok
            </button>
          </div>
        )}
        {(viewMode === "form" || viewMode === "both") && (
          <>
            {viewMode !== "both" && (
              <div
                onClick={() => {
                  setViewMode("list");
                  localStorage.removeItem("showDocuForm");
                }}
                className="ml-auto my-1 mr-[1.2rem] border text-sm border-gray-600 rounded-md py-2 px-4 flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white stroke-black hover:stroke-white"
              >
                <svg
                  className="w-5  "
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.20513 12.5C6.66296 14.7936 8.9567 16.9 12.5 16.9C16.0433 16.9 18.3371 14.7936 19.7949 12.5C18.3371 10.2064 16.0433 8.1 12.5 8.1C8.9567 8.1 6.66296 10.2064 5.20513 12.5ZM3.98551 12.1913C5.53974 9.60093 8.20179 6.9 12.5 6.9C16.7982 6.9 19.4603 9.60093 21.0145 12.1913L21.1997 12.5L21.0145 12.8087C19.4603 15.3991 16.7982 18.1 12.5 18.1C8.20179 18.1 5.53974 15.3991 3.98551 12.8087L3.80029 12.5L3.98551 12.1913ZM12.5 9.4C10.7879 9.4 9.4 10.7879 9.4 12.5C9.4 14.2121 10.7879 15.6 12.5 15.6C14.2121 15.6 15.6 14.2121 15.6 12.5C15.6 10.7879 14.2121 9.4 12.5 9.4Z"
                      fill="#121923"
                    ></path>
                  </g>
                </svg>
                View Documents
              </div>
            )}
            <section className="w-[94%] md:w-[60%] h-[97%] md:-mt-5  mx-3 md:mx-4 shadow-2xl rounded-2xl border-2 py-3 md:py-6 px-2 md:px-6 relative">
              <form
                action=""
                className="h-[100%]  w-full"
                onSubmit={
                  btnText === "Create" ? createDocument : updateDocument
                }
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     btnText === "Create"
                //       ? createDocument(e)
                //       : updateDocument(e);
                //   }
                // }}
              >
                <div className="flex items-center justify-between">
                  <input
                    placeholder="Enter Title"
                    readOnly={isReadOnly}
                    value={content.title}
                    onChange={(e) => {
                      setContent({ ...content, title: e.target.value });
                    }}
                    className="w-[100%] h-[13%] outline-none border-b border-gray-700  py-4 px-4 bg-transparent font-serif font-bold "
                  />
                </div>

                <div className=" h-[75%]">
                  <textarea
                    placeholder="Start Documenting..."
                    readOnly={isReadOnly}
                    value={content.body}
                    onChange={(e) => {
                      setContent({ ...content, body: e.target.value });
                    }}
                    className="w-full p-4 bg-transparent outline-none h-full"
                  ></textarea>
                </div>

                <div className=" flex md:mt-4 pb-1 sm:py-2 text-xs md:text-[1rem] h-[12%] ">
                  {!isReadOnly && (
                    <>
                      {(content.title !== "" || content.body !== "") && (
                        <button
                          className={` 
                           
                           text-white py-2  md:py-3 px-8 rounded-xl bg-black hover:text-black hover:bg-white hover:border border-black cursor-pointer `}
                          onClick={(e) => {
                            e.preventDefault();
                            setContent({ id: "", body: "", title: "" });
                            setBtnText("Create");
                          }}
                        >
                          Discard
                        </button>
                      )}
                      <button
                        disabled={
                          content.title.length < 2 || content.body.length < 2
                        }
                        type="submit"
                        className={` ml-auto py-2 px-8  text-white rounded-xl  ${
                          content.title.length < 2 || content.body.length < 2
                            ? `bg-gray-400 cursor-not-allowed `
                            : `bg-black hover:text-black hover:bg-white hover:border border-black cursor-pointer  `
                        }  `}
                      >
                        {btnText}
                      </button>
                    </>
                  )}
                  {isReadOnly && (
                    <svg
                      className="w-8 cursor-pointer ml-auto mr-[2rem]"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        setContent({ id: "", body: "", title: "" });
                        // setIsDisabled({ saveBtn: true, discardBtn: true });
                        setIsReadOnly(false);
                        localStorage.removeItem("isReadyonly");
                      }}
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <g id="cancel">
                          <g id="cancel_2">
                            <path
                              id="Combined Shape"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M36.3291 10.2931L29.0251 17.5971C28.9938 17.6284 28.961 17.6571 28.9269 17.6834C28.9002 17.7181 28.871 17.7515 28.8393 17.7833L25.4403 21.1822L26.8539 22.5958L37.7428 11.7069C38.1342 11.3156 38.1342 10.6834 37.7419 10.2922C37.3527 9.90193 36.7192 9.90193 36.3291 10.2931ZM28.2682 24.01L39.1571 13.1211C40.3297 11.9484 40.3297 10.0486 39.1562 8.87798C37.9872 7.70606 36.0847 7.70606 34.9139 8.87979L27.6108 16.1829C27.5791 16.2147 27.5499 16.2481 27.5232 16.2828C27.4891 16.3091 27.4563 16.3378 27.425 16.3691L24.0261 19.768L23.3883 19.1301C23.3784 19.1202 23.3684 19.1107 23.3583 19.1013L13.1527 8.89569C11.9828 7.72286 10.0803 7.72286 8.90954 8.89659C7.74007 10.0691 7.74007 11.9675 8.91044 13.1379L19.7833 24.0108L8.92904 34.8651C8.80498 34.9853 8.63403 35.1885 8.46649 35.4607C7.76939 36.5931 7.76653 37.9264 8.92154 39.0798C10.0972 40.2298 11.4174 40.2314 12.5531 39.5674C12.8256 39.408 13.0302 39.2449 13.1621 39.1163L21.9373 30.3413C22.3278 29.9508 22.3278 29.3176 21.9373 28.9271C21.5467 28.5366 20.9136 28.5366 20.523 28.9271L11.757 37.6931C11.7422 37.7074 11.6609 37.7722 11.5436 37.8408C11.1166 38.0905 10.7697 38.0901 10.351 37.6807C9.91539 37.2458 9.91609 36.921 10.1697 36.5091C10.2407 36.3938 10.3083 36.3134 10.3326 36.2898L24.0261 22.5964L25.4397 24.01L23.4948 25.9549C23.3637 26.086 23.2766 26.2445 23.2335 26.412C23.0117 26.7946 23.0645 27.2928 23.392 27.6203L34.908 39.1363C36.0806 40.3088 37.9797 40.3088 39.1523 39.1363C40.3226 37.9629 40.3226 36.0645 39.1523 34.8941L28.2682 24.01ZM26.8539 25.4242L25.4392 26.839L36.3223 37.7221C36.7137 38.1136 37.3466 38.1136 37.7371 37.723C38.1277 37.3315 38.1277 36.6979 37.738 36.3083L26.8539 25.4242ZM22.6113 21.1828L21.1975 22.5966L10.3247 11.7237C9.93503 11.3341 9.93503 10.7005 10.3256 10.309C10.7148 9.91873 11.3483 9.91873 11.7375 10.309L22.6113 21.1828Z"
                              fill="#000"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  )}
                </div>
              </form>
            </section>
          </>
        )}

        {(viewMode === "list" || viewMode === "both") && (
          <>
            {viewMode !== "both" && (
              <div
                onClick={() => {
                  setViewMode("form");
                  setContent({ id: "", title: "", body: "" });
                  localStorage.setItem("showDocuForm", "true");
                }}
                className="ml-auto my-1 mr-[1.4rem] border text-sm border-gray-600 rounded-md py-2 px-4 flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white stroke-black hover:stroke-white"
              >
                <svg
                  className=" w-5  "
                  viewBox="0 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <title>plus-circle</title>
                    <desc>Created with Sketch Beta.</desc>
                    <defs> </defs>
                    <g id="Page-1" strokeWidth="1" fillRule="evenodd">
                      <g
                        id="Icon-Set"
                        transform="translate(-464.000000, -1087.000000)"
                      >
                        <path
                          d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z"
                          id="plus-circle"
                        >
                          {" "}
                        </path>
                      </g>
                    </g>
                  </g>
                </svg>
                Create new Documentation
              </div>
            )}

            <section className="  h-full w-full pb-[4rem] sm:pb-0 md:w-[38%]  overflow-y-scroll">
              {Searching ? (
                <div className="h-full w-full flex justify-center items-center">
                  <LoadingSpinner
                    styles={{
                      svg: "h-6 w-6 sm:h-9 sm:w-9  lmd:h-6 lmd:w-6",
                      span: "text-sm sm:text-[1.1rem] lmd:text-sm",
                    }}
                    text="Searching..."
                  />
                </div>
              ) : documents.length === 0 ? (
                <div className="h-full w-full flex justify-center items-center font-bold text-[0.910rem] sm:text-[1.2rem] md:text-[0.8rem] lmd:text-[0.910rem]">
                  <p>You have no documents yet.</p>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="h-full w-full flex justify-center items-center text-[0.910rem] sm:text-[1.2rem] md:text-[0.8rem] lmd:text-[0.910rem]">
                  <p>No matching documents found for &quot;{match}&quot;.</p>
                </div>
              ) : (
                <div className="flex flex-col md:mb-0 gap-[1.1rem]  sm:gap-[1rem] md:gap-[1.4rem]  px-4 md:px-2 h-full w-full md:w-[100%] ">
                  {filteredDocuments.map((document: DocumentType) => (
                    <div
                      key={document.id}
                      className="tooltip-container  flex flex-col justify-center w-full border shadow-xl rounded-tr-none rounded-bl-none rounded-[3rem] px-4 md:px-6 py-4 sm:py-[3rem] lmd:py-10  bg-black text-white relative cursor-pointer"
                      // onMouseOver={() => HandleDisplayMore(document.id)}
                      // onMouseLeave={() => HandleHideMore(document.id)}
                    >
                      <div className="flex items-center justify-center w-full mb-3 lmd:mb-4">
                        <h1 className="flex justify-between items-center font-mono pt-3 sm:pt-2 md:pt-0 font-bold text-xl md:text-lg ">
                          {document.title.length > 15
                            ? document.title.substring(0, 15) + `...`
                            : document.title}
                        </h1>
                        <p className="ml-auto text-xs   font-mono font-semibold pl-1">
                          {formatDate(document.date)}
                        </p>
                      </div>

                      <p className=" text-sm sm:text[1rem] lmd:text-[0.9rem] pl-3 font-serif pb-3 sm:pb-2 md:pb-0">
                        {document.content.length > 220
                          ? document.content.substring(0, 240) + `...`
                          : document.content}
                      </p>

                      <ul
                        className={`style-task-tooltip absolute top-14 right-1 bg-white text-black w-fit p-2 list-disc list-inside font-mono font-medium rounded-2xl`}
                      >
                        <li
                          className="hover:bg-black hover:text-white rounded-xl px-4 py-1 cursor-pointer"
                          onClick={() => readDocument(document.id)}
                        >
                          Read Document{" "}
                        </li>
                        <li
                          className="hover:bg-black hover:text-white rounded-xl px-4 py-1 cursor-pointer"
                          onClick={() => editDocument(document.id)}
                        >
                          Edit Document
                        </li>
                        <li
                          className="hover:bg-red-600 hover:text-white rounded-xl px-4 py-1 cursor-pointer"
                          onClick={() => {
                            setValidate(!validate);
                            setDocId(document.id);
                            // deleteDocument(document.id)
                          }}
                        >
                          Delete Document
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
