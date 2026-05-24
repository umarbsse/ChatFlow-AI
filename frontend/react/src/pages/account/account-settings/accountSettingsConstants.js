export const initialAccountSettingsFormData = {
  name: "",
  email: "",
};

export function normalizeUserResponse(responseData, fallbackData = {}) {
  const user =
    responseData?.data?.user ||
    responseData?.data ||
    responseData?.user ||
    fallbackData;

  return {
    name: user?.name || fallbackData.name || "",
    email: user?.email || fallbackData.email || "",
  };
}