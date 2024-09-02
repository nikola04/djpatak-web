"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { IoClose } from "react-icons/io5";
import { FiAlertCircle, FiAlertTriangle } from "react-icons/fi";
import { v4 as uuid } from "uuid";
import { SmallIconButton } from "../Buttons";

type Alert = {
  id: string;
  isError: boolean;
  message: string;
  timeRemaining: number;
};
interface AlertContextType {
  alerts: Alert[];
  pushAlert: (alert: string, error?: boolean) => any;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const pushAlert = (alert: string, error: boolean = true) =>
    setAlerts((prev) => {
      return [
        ...prev,
        {
          id: uuid(),
          message: alert,
          isError: error,
          timeRemaining: error ? 30 : 7,
        },
      ];
    });
  const dropAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((item) => ({
        ...item,
        timeRemaining: item.id === alertId ? 0 : item.timeRemaining,
      })),
    );
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) =>
        prev
          .filter((i) => i.timeRemaining >= 0)
          .map((item) => ({
            ...item,
            timeRemaining: item.timeRemaining - 1,
          })),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <AlertContext.Provider value={{ alerts, pushAlert }}>
      {children}
      <div className="fixed z-50 bottom-16 right-0">
        <div className="relative m-6 flex flex-col transition-all duration-[320] ease">
          {alerts.map(({ id, message, isError, timeRemaining }) => (
            <Alert
              key={id}
              message={message}
              isError={isError}
              onCloseAlert={() => dropAlert(id)}
              shouldDrop={timeRemaining < 1}
            />
          ))}
        </div>
      </div>
    </AlertContext.Provider>
  );
}

function Alert({
  message,
  isError,
  shouldDrop,
  onCloseAlert,
}: {
  message: string;
  isError: boolean;
  onCloseAlert: () => any;
  shouldDrop: boolean;
}) {
  const [isDropped, setIsDropped] = useState<boolean>(false);
  const dropAlert = useCallback(() => {
    if (shouldDrop) setIsDropped(true);
    else setIsDropped(false);
  }, [shouldDrop]);
  const Icon = isError ? FiAlertTriangle : FiAlertCircle;
  return (
    !isDropped && (
      <div
        onAnimationEnd={() => dropAlert()}
        className={`relative flex flex-col items-start rounded-md overflow-hidden my-2 ${isError ? "bg-red-ansi" : "bg-green-success"} ${shouldDrop && "animate-dropError"}`}
      >
        <div className="flex items-center px-1 py-1.5 w-full">
          <Icon className="text-white-default text-xl mx-2" />
          <p className="text-white-default">{message}</p>
          <div className="ml-auto pl-1">
            <SmallIconButton
              className="mx-1"
              title="Close"
              icon={<IoClose className="text-2xl" />}
              onClick={onCloseAlert}
            />
          </div>
        </div>
        <div
          className={`w-full h-[3px] ${isError ? "bg-red-700" : "bg-green-700"}`}
        ></div>
      </div>
    )
  );
}
