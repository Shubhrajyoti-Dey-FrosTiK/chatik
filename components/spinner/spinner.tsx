import { ClipLoader } from "react-spinners";
import { LoaderSizeProps } from "react-spinners/helpers/props";

function Spinner(props: LoaderSizeProps) {
  return (
    <div>
      <div className="dark:hidden">
        <ClipLoader {...props} color="white" />
      </div>
      <div className="hidden dark:block">
        <ClipLoader {...props} color="white" />
      </div>
    </div>
  );
}

export default Spinner;
