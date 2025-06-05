import { ClipLoader } from "react-spinners";
import { LoaderSizeProps } from "react-spinners/helpers/props";

function Spinner(props: LoaderSizeProps) {
  return (
    <div>
      <div className="dark:hidden">
        <ClipLoader color="white" {...props} />
      </div>
      <div className="hidden dark:block">
        <ClipLoader color="white" {...props} />
      </div>
    </div>
  );
}

export default Spinner;
