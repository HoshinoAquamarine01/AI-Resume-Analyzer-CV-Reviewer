export const formatResponse = (
  data: any,
  message: string,
  status = "success",
) => {
  return {
    status,
    message,
    data,
  };
};
