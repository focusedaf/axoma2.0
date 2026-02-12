import { toast } from "sonner";

let violationCount = 0;
let intervalId: NodeJS.Timeout | null = null;

let cleanupFunctions: (() => void)[] = [];

export function initAntiCheat(onViolationLimit: () => void) {
  const VIOLATION_LIMIT = 3;

  const registerViolation = (reason: string) => {
    violationCount++;

    toast.error(`Violation detected: ${reason}`, {
      description: `Warning ${violationCount}/${VIOLATION_LIMIT}`,
    });

    if (violationCount >= VIOLATION_LIMIT) {
      toast.error("Exam auto-submitted due to multiple violations.");
      onViolationLimit();
    }
  };

  const handleVisibility = () => {
    if (document.hidden) {
      registerViolation("Tab switching detected");
    }
  };
  document.addEventListener("visibilitychange", handleVisibility);
  cleanupFunctions.push(() =>
    document.removeEventListener("visibilitychange", handleVisibility),
  );

  const handleBlur = () => registerViolation("Window focus lost");
  window.addEventListener("blur", handleBlur);
  cleanupFunctions.push(() => window.removeEventListener("blur", handleBlur));

  intervalId = setInterval(() => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      registerViolation("Developer tools detected");
    }
  }, 3000);
}

export function stopAntiCheat() {
  cleanupFunctions.forEach((fn) => fn());
  cleanupFunctions = [];

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  violationCount = 0;
}
