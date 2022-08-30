import { toast } from "react-toastify";

export const useNotify = (content: string) => toast(content);
