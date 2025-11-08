interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface FormDataState {
  name: string;
}

type ProjectsCategoryProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  itemName?: string;
};

type FormModalProjectsCategoryProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingCategory: Category | null;
  formData: { name: string };
  setFormData: (v: { name: string }) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  resetForm: () => void;
  useTriggerButton?: boolean;
};
