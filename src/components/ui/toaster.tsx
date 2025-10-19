import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-blue-600 text-white border-blue-600">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-white">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-white">
                  <span className="mr-2">✓</span>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white hover:text-white/80" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
