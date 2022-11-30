import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = ({}) => {
  return true;
};

export default function InternalIndex() {
  return <div className="text-white">HEIHEI</div>;
}
