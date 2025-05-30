
let accessToken = "";

export const tokenService = {
    get: () => accessToken,
    set: (token: string) => {
        accessToken = token;
    },
    clear: () => {
        accessToken = "";
    }
}