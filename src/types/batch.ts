export type BatchRecord = {
  id: number;
  title: string;
  branch: {
    id: number;
    title: string;
  };
  day: string;
  timing: {
    from: string;
    to: string;
  } | null;
};
