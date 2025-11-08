interface Skill {
  _id?: string;
  imageUrl: string;
  title: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
}

interface PendingUpload {
  file: File;
  imageUrl: string;
  title: string;
}

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isEditing: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  pendingUploads: any[];
  setPendingUploads: (updater: any) => void;
  uploadProgress: any[];
  setUploadProgress: (updater: any) => void;
  isUploading: boolean;
  handleMultipleFileUpload: (files: File[]) => void;
  isSubmitting: boolean;
};

type DeleteModalSkillsProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};
