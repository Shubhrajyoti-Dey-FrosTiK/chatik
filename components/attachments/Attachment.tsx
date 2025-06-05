import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { AttachmentClassification } from "@/convex/schema/message";
import { ClientSideAttachment } from "@/hooks/use-attachments";
import { IconBrandYoutubeFilled, IconPdf } from "@tabler/icons-react";
import { Image, X } from "lucide-react";
import { ProgressWithValue } from "../ui/progress-with-value";

interface Props {
  attachments: ClientSideAttachment[];
  handleDeleteAttachmentById?: (attachmentId: string) => Promise<void>;
}

export function getShortName(name: string) {
  if (name.length > 15) {
    return name.slice(0, 15) + "...";
  }
  return name;
}

function Attachments(props: Props) {
  const { attachments, handleDeleteAttachmentById } = props;

  return (
    <div className="flex items-center flex-wrap gap-2">
      {attachments.map((attachment) => {
        return (
          <CardContainer
            key={attachment.attachmentId}
            className="inter-var attachment py-0 max-w-[200px]"
          >
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] sm:w-[30rem] h-auto rounded-xl p-3 border  ">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white w-full"
              >
                <div className="flex items-center gap-2 justify-between w-full">
                  <div className="flex items-center gap-2 w-full">
                    {attachment.attachmentClassification ==
                      AttachmentClassification.PDF && (
                      <IconPdf size={25} color="red" />
                    )}
                    {attachment.attachmentClassification ==
                      AttachmentClassification.IMAGE && (
                      <Image size={25} color="green" />
                    )}
                    {attachment.attachmentClassification ==
                      AttachmentClassification.YOUTUBE && (
                      <IconBrandYoutubeFilled size={25} color="orange" />
                    )}
                    <div className="w-full">
                      <p className="text-xs">
                        {getShortName(attachment.fileName)}
                      </p>
                      {attachment.uploadPercentage != 100 && (
                        <ProgressWithValue
                          value={attachment.uploadPercentage}
                          position="end-outside"
                        />
                      )}
                    </div>
                  </div>
                  {attachment.uploadPercentage == 100 &&
                    handleDeleteAttachmentById && (
                      <X
                        onClick={async () => {
                          await handleDeleteAttachmentById(
                            attachment.attachmentId,
                          );
                        }}
                        size={15}
                        className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 cursor-pointer"
                      />
                    )}
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        );
      })}
    </div>
  );
}

export default Attachments;
