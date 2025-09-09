import { api } from "../axios";

interface SettingsServiceType {
  updateUserImage(data: FormData): Promise<any>;
}

export const SettingsServices: SettingsServiceType = {
  updateUserImage: async (data: FormData) => {
    const res = await api.post("/settings/update-user-image", data);
    const img = res.data.imageUrl;
    return img;
  },
};
