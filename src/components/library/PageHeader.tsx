import { HTMLAttributes, ReactNode } from "react";
import { SmallIconButton } from "../Buttons";
import { FaArrowLeft } from "react-icons/fa";

interface LibraryPageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  path: string[];
  folder?: boolean;
  goBack?: () => any;
  Buttons?: () => JSX.Element;
}
export const LibraryPageHeader = ({
  title,
  path,
  folder = true,
  Buttons,
  goBack,
  ...restProps
}: LibraryPageHeaderProps) => {
  return (
    <div
      {...restProps}
      className={`flex w-full items-center justify-between ${restProps.className}`}
    >
      <div>
        <p className="text-white-default opacity-40 text-sm py-0.5">
          {path.join(" / ")} {folder && "/"}
        </p>
        <div className="flex items-center">
          {path.length > 1 && (
            <SmallIconButton
              title="Playlists"
              className="my-1 mr-1"
              icon={<FaArrowLeft />}
              onClick={() => goBack && goBack()}
            />
          )}
          <h2 className="text-white-default text-xl font-bold py-2">{title}</h2>
        </div>
      </div>
      <div className={`mr-2 place-self-start`}>{Buttons && <Buttons />}</div>
    </div>
  );
};
