type DeleteModalProjectsFrameworksProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

type FormModalProjectsFrameworksProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isEditing: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  dropZoneRef: MutableRefObject<HTMLDivElement | null>;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  pendingUploads: PendingUpload[];
  setPendingUploads: React.Dispatch<React.SetStateAction<PendingUpload[]>>;
  uploadProgress: UploadProgress[];
  setUploadProgress: React.Dispatch<React.SetStateAction<UploadProgress[]>>;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  isUploading: boolean;
  isSubmitting: boolean;
  handleMultipleFileUpload: (files: File[]) => void;
};
