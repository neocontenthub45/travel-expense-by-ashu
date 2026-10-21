type ToastType = "success" | "error" | "info";

type ToastPayload = {
  id: number;
  message: string;
  type: ToastType;
};

type Listener = (toasts: ToastPayload[]) => void;

let toasts: ToastPayload[] = [];
let listeners: Listener[] = [];
let counter = 0;

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

export function showToast(message: string, type: ToastType = "info") {
  const id = ++counter;
  toasts = [...toasts, { id, message, type }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3500);
}

export function subscribeToasts(listener: Listener) {
  listeners.push(listener);
  listener([...toasts]);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}