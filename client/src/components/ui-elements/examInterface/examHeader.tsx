import { Button } from "@/components/ui/button";


interface ExamHeaderProps {
  examTitle: string;
  timeLeft: string;
  onSubmit: () => void;
}

const ExamHeader = ({ examTitle, timeLeft, onSubmit }: ExamHeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b bg-white/60 backdrop-blur-sm p-4 rounded-md shadow-sm mb-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl tracking-tight">{examTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="font-mono text-sm px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200">
          {timeLeft}
        </div>
        <Button
          onClick={onSubmit}
          className="min-w-[110px] bg-blue-600 hover:bg-blue-700"
        >
          Submit
        </Button>
      </div>
    </header>
  );
};

export default ExamHeader;
