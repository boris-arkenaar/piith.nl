import { PractitionerData } from "../lib/api";

type PractitionerLogoProps = {
  className: string;
  practitioner: PractitionerData;
};

const PractitionerLogo: React.FC<PractitionerLogoProps> = ({
  className,
  practitioner,
}) =>
  practitioner.companyLogo ? (
    <img
      className={className}
      src={practitioner.companyLogo}
      alt={`Logo ${practitioner.company || practitioner.name}`}
      width="48"
      height="48"
    />
  ) : null;

export default PractitionerLogo;
