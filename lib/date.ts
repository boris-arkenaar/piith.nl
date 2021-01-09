import { formatRelative, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

const locale = {
  ...nl,
  formatRelative: (token) =>
    token === "other" ? "PPP" : nl.formatRelative(token),
};

export const formatDate = (date: string): string =>
  formatRelative(parseISO(date), new Date(), { locale });
