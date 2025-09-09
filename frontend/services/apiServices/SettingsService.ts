import { api } from "../axios";

interface SettingsServiceType {
  updateUserImage(data: FormData): Promise<any>;
  updateUsername(name: string): Promise<string>;
  changePassword(payload: any): Promise<any>;
  changeGoogleAccount(credential: any): Promise<any>
}

export const SettingsServices: SettingsServiceType = {
  updateUserImage: async (data: FormData) => {
    const res = await api.post("/settings/update-user-image", data);
    const img = res.data.imageUrl;
    return img;
  },

  updateUsername: async (name: string) => {
    const res = await api.post("/settings/update-username", { Username: name });
    const newUsername = res.data.newUserName;
    return newUsername;
  },

  changePassword: async (payload: any) => {
    await api.post("/settings/change-password", payload);
  },

  changeGoogleAccount: async (credential: string) => {
    const res = await api.post("/settings/change-google-account", {
      Token: credential,
    });
    return res.data.accessToken;
  },
};
