import { useForm } from "react-hook-form";

export type FormProps<T extends {}> = {
  form: ReturnType<typeof useForm<T>>;
  onSubmit: (data: T) => void;
};
