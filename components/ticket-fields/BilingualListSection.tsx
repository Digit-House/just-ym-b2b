import { ReactNode } from "react";
import { ListTodo, NotebookIcon } from "lucide-react";

const note = (c: string) => <NotebookIcon className={`h-5 w-5 ${c}`} />;
/** Section icon per list field (ticket field name, option field name). */
export const LIST_ICONS: Record<string, ReactNode> = {
  exclusions: note("text-red-500"),
  highlights: note("text-yellow-500"),
  inclusions: note("text-green-500"),
  thingsToNote: note("text-purple-500"),
  howToUseList: <ListTodo className="h-5 w-5 text-blue-500" />,
  howToUse: <ListTodo className="h-5 w-5 text-blue-500" />,
};

const Side = ({ name, children }: { name: string; children: ReactNode }) => (
  <div className="space-y-3">
    <h5 className="text-sm font-medium text-gray-600 uppercase tracking-wider">{name}</h5>
    {children}
  </div>
);

/** One list in two languages: heading, then English and Myanmar side by side. */
const BilingualListSection = ({
  title,
  icon,
  en,
  mm,
}: {
  title: string;
  icon?: ReactNode;
  en: ReactNode;
  mm: ReactNode;
}) => (
  <div className="space-y-4">
    <div className="own-label flex items-center gap-2 mb-4">
      {icon}
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Side name="English">{en}</Side>
      <Side name="Myanmar">{mm}</Side>
    </div>
  </div>
);

export default BilingualListSection;
