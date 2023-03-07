import Link from "next/link";

import { PractitionerData } from "../lib/api";

type PractitionerNavigationProps = {
  practitioners: PractitionerData[];
};

const PractitionerNavigation: React.FC<PractitionerNavigationProps> = ({
  practitioners,
}) => (
  <nav className="sub-menu">
    <ul className="sub-menu">
      {practitioners.map((practitioner) => (
        <li className="menu-item" key={practitioner.id}>
          <Link href={`/wie-doet-wat/${practitioner.id}`}>
            {practitioner.name}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default PractitionerNavigation;
