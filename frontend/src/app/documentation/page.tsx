"use client";
import { useState } from "react";
import { documents } from "../../../mock";
import { DocummentType } from "../../../Interfaces";
import Header from "../components/header";

interface FilterByType {
  title: string | undefined;
  date: Date | undefined;
}

export default function page() {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>();
  const [isFeedBack, setIsFeedBack] = useState<boolean>();
  const [IsDisabled, setIsDisabled] = useState({
    saveBtn: true,
    discardBtn: true,
  });
  const [feedbackText, setFeedbackText] = useState<string | undefined>(
    undefined
  );
  const [content, setContent] = useState({
    title: "",
    body: "",
  });
   const [filterBy, setFilterBy] = useState<FilterByType>({ 
    title : undefined,
    date : undefined
   })

  
  // functions

  const handleFilterBy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(filterBy);
  };

  const HandleDisplayMore = (id: string) => {
    const document = documents.find((d) => d.id === id);
    document !== undefined
      ? document.isHovered === true
      : console.log(`${document} not found`);
  };

  const HandleHideMore = (id: string) => {
    const document = documents.find((d) => d.id === id);
    document !== undefined
      ? document.isHovered === false
      : console.log(`${document} not found`);
  };

  const ReadDocument = (id: string) => {
    const document = documents.find((d) => d.id === id);
    if (document !== undefined) {
      setContent({ title: document.title, body: document.content });
      setIsReadOnly(true);
    } else {
      console.log(`${document} not found `);
    }
  };

  const EditDocument = (id: string) => {
    const document = documents.find((d) => d.id === id);
    if (document !== undefined) {
      setContent({ title: document.title, body: document.content });
      setIsReadOnly(false);
      setIsDisabled({ saveBtn: false, discardBtn: false });
    } else console.log(`${document} not found `);
  };

  return (
    <>
      <Header />
      <main className="flex justify-between items-center flex-col gap-4 md:gap-2 md:flex-row h-[85%] pt-4 md:pt-8 mt-3 border-gray-500 border-t-2 border-dashed">
        <section className="w-[94%] md:w-[60%] h-[80vh] sm:h-[95vh] md:h-full mx-3 md:mx-4 shadow-2xl rounded-2xl border py-2 md:py-6 px-2 md:px-6 relative">
          <form action="" className="h-full w-full">
            <div className="flex items-center justify-between">
              <input
                placeholder="Enter Title"
                readOnly={isReadOnly}
                value={content.title}
                onChange={(e) => {
                  setContent({ ...content, title: e.target.value });

                  console.log(content.title);
                }}
                onFocus={() =>
                  content.body.length > 2
                    ? setIsDisabled({ discardBtn: false, saveBtn: false })
                    : setIsDisabled({ discardBtn: true, saveBtn: true })
                }
                onMouseOut={() =>
                  content.title.length > 2
                    ? setIsDisabled({ discardBtn: false, saveBtn: false })
                    : setIsDisabled({ discardBtn: true, saveBtn: true })
                }
                className="w-[100%] outline-none border-b border-gray-700  py-2 px-4 bg-transparent font-serif font-bold "
              />
            </div>

            <div className=" h-[58%] md:h-[78%]">
              <textarea
                placeholder="Start Documenting..."
                readOnly={isReadOnly}
                value={content.body}
                onChange={(e) => {
                  setContent({ ...content, body: e.target.value });
                  console.log(content.body);
                }}
                onFocus={() =>
                  content.title.length > 2
                    ? setIsDisabled({ discardBtn: false, saveBtn: false })
                    : setIsDisabled({ discardBtn: true, saveBtn: true })
                }
                onMouseLeave={() =>
                  content.body.length > 2
                    ? setIsDisabled({ discardBtn: false, saveBtn: false })
                    : setIsDisabled({ discardBtn: true, saveBtn: true })
                }
                className="w-full h-full p-4 bg-transparent outline-none"
              ></textarea>
            </div>

            <div className=" flex justify-end mt-2.5 md:mt-4 text-xs md:text-[1rem]">
              {!isReadOnly && (
                <>
                  <button
                    disabled={IsDisabled.discardBtn}
                    className={` ${
                      IsDisabled.discardBtn
                        ? `bg-gray-400 cursor-not-allowed `
                        : `bg-black hover:text-black hover:bg-white hover:border border-black cursor-pointer  `
                    } text-white py-2  md:py-3 px-8 rounded-xl  `}
                    onClick={(e) => {
                      e.preventDefault();
                      setContent({ body: "", title: "" });
                    }}
                  >
                    Discard
                  </button>
                  <button
                    disabled={IsDisabled.saveBtn}
                    type="submit"
                    className={` ml-auto py-2 px-8  text-white rounded-xl  ${
                      IsDisabled.saveBtn
                        ? `bg-gray-400 cursor-not-allowed `
                        : `bg-black hover:text-black hover:bg-white hover:border border-black cursor-pointer  `
                    }  `}
                    onClick={(e) => {
                      e.preventDefault();
                      if (content.body.length > 2 && content.title.length > 2) {
                        setIsFeedBack(!isFeedBack);
                        setFeedbackText("Document Saved Successfully");
                      } else {
                        setIsFeedBack(!isFeedBack);
                        setFeedbackText("Please Fill All Fields");
                      }
                    }}
                  >
                    Save
                  </button>
                </>
              )}
              {isReadOnly && (
                <svg
                  className="w-8 cursor-pointer "
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    setContent({ body: "", title: "" });
                    setIsDisabled({ saveBtn: true, discardBtn: true });
                    setIsReadOnly(false);
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

          {isFeedBack && (
            <div
              className={` ${
                feedbackText?.endsWith("Successfully")
                  ? `bg-green-500`
                  : `bg-red-500`
              }   border w-[80%] h-fit py-10 flex flex-col gap-4 justify-center items-center rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
            >
              <p className=" text-2xl text-white font-mono font-semibold">
                {feedbackText}
              </p>
              <button
                className="bg-white text-black py-3 px-10 rounded-2xl font-bold hover:scale-90 transition-transform duration-300"
                onClick={() => {
                  setIsFeedBack(!isFeedBack);
                  if (feedbackText?.endsWith("Successfully")) {
                    setContent({ body: "", title: "" });
                    setIsDisabled({ saveBtn: true, discardBtn: true });
                  }
                }}
              >
                Ok
              </button>
            </div>
          )}
        </section>

        <section className="  h-full w-full md:w-[38%] ">
          <div
            onClick={() => setShowFilter(true)}
            className=" w-fit ml-auto -mt-6 mb-2 mr-6 z-20 border text-sm border-gray-600 rounded-md py-2 px-4 flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white stroke-black hover:stroke-white"
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

          <div className="flex items-center gap-3 relative">
            {showFilter && (
              <div className="bg-black w-[15rem] text-white py-4 px-5 absolute -top-12 right-4 z-10 rounded-xl border border-gray-600">
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
                <h1 className="border-b text-sm mb-4 w-fit pb-1">
                  Filter by :
                </h1>

                <form
                  action=""
                  onSubmit={handleFilterBy}
                  className="flex flex-col gap-4"
                  // onSubmit={handleFilterBy}
                >
                  <div className={`flex flex-col text-sm w-[100%]`}>
                    <label className=" font-medium">Title</label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Title"
                      // defaultChecked={filterBy.allTask}
                      onChange={(e) =>
                        setFilterBy({...filterBy, title: e.target.value})
                      }
                      className="border border-gray-600 text-black rounded-lg outline-none py-2 px-2 w-full"
                    />
                  </div>

                  <div className={`flex flex-col text-sm w-[100%]`}>
                      <label className=" font-medium">Date</label>
                      <input
                        id="deadline"
                        type="date"
                        onChange={(e) =>
                          setFilterBy({...filterBy, date : new Date(e.target.value)})
                        }
                        placeholder="DD/MM/YYYY"
                        className="border border-gray-600 text-black rounded-lg outline-none py-2 px-2 w-full"
                      />
                    </div>

                    <div className="py-2 px-4 rounded-md cursor-pointer text-sm text-black hover:text-white  bg-white hover:bg-black border my-2 ml-auto">
                      <button type="submit">Confirm</button>
                    </div>
                    
                </form>
              </div>
            )}
          </div>

          <div className="flex flex-col mb-10 md:mb-0  gap-[1.2rem] px-2 overflow-y-scroll h-full w-full md:w-[100%] ">
            {documents.map((document: DocummentType) => (
              <div
                key={document.id}
                className="tooltip-container  flex flex-col justify-center  w-full h-[35rem] border shadow-xl rounded-2xl px-4 md:px-6 py-6  bg-black text-white relative cursor-pointer"
                onMouseOver={() => HandleDisplayMore(document.id)}
                onMouseLeave={() => HandleHideMore(document.id)}
              >
                <h1 className="flex justify-between items-center font-mono font-bold text-xl md:text-lg lmd:text-2xl">
                  {document.title}
                </h1>
                <p className="text-xs md:text-xs lmd:text-sm mt-1 mb-2 md:mb-3 font-mono font-semibold pl-1">
                  {document.formattedDate}
                </p>
                <p className=" text-sm lmd:text-[1rem] px-3 font-serif">
                  {document.content.length > 200
                    ? document.content.substring(0, 200) + `...`
                    : document.content}
                </p>

                <ul
                  className={`
                  style-task-tooltip absolute top-14 right-1 bg-white text-black w-fit p-2 list-disc list-inside font-mono font-medium rounded-2xl`}
                >
                  <li
                    className="hover:bg-black hover:text-white rounded-xl px-4 py-1 cursor-pointer"
                    onClick={() => ReadDocument(document.id)}
                  >
                    Read Document{" "}
                  </li>
                  <li
                    className="hover:bg-black hover:text-white rounded-xl px-4 py-1 cursor-pointer"
                    onClick={() => EditDocument(document.id)}
                  >
                    Edit Document
                  </li>
                  <li className="hover:bg-red-600 hover:text-white rounded-xl px-4 py-1 cursor-pointer">
                    Delete Document
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
