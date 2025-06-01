import { ClipLoader } from "react-spinners";

function Spinner() {
  return (
    <div>
      <div className="dark:hidden">
        <ClipLoader color="white" />
      </div>
      <div className="hidden dark:block">
        <ClipLoader color="white" />
      </div>
    </div>
  );
}

export default Spinner;
