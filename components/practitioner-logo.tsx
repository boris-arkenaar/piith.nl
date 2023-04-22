import Image from "next/image";
import { PractitionerData } from "../lib/api";
import { getCloudinaryLoader } from "./markdown-image";

const width = 48;
const height = 48;

type PractitionerLogoProps = {
  className: string;
  practitioner: PractitionerData;
};

const PractitionerLogo: React.FC<PractitionerLogoProps> = ({
  className,
  practitioner,
}) =>
  practitioner.companyLogo ? (
    <Image
      className={className}
      loader={getCloudinaryLoader(width * 2, height * 2)}
      src={practitioner.companyLogo}
      alt={`Logo ${practitioner.company || practitioner.name}`}
      width={width}
      height={height}
    />
  ) : null;

export default PractitionerLogo;
