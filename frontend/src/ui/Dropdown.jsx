import { ArrowDown } from "lucide-react";

export const Dropdown = ({ names, items }) => {
  return (
    <details className="dropdown">
      <summary className="btn m-1">
        {names}
        <ArrowDown className="w-3" />
      </summary>

      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {items.map((item) => (
          <li key={item}>
            <a>{item}</a>
          </li>
        ))}
      </ul>
    </details>
  );
};
