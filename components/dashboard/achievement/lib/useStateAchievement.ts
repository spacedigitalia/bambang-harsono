"use client";

import { useState, useEffect, useRef } from "react";

import { toast } from "sonner";

export const useStateAchievement = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<Achievement>({
    imageUrl: "",
    title: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getFilterOptions = () => {
    const options = new Set(
      achievements.map((achievement) => {
        const parts = achievement.title.split(" - ");
        return parts[0].trim(); // Get the part before the hyphen
      })
    );
    return Array.from(options).sort();
  };

  const filteredAchievements = achievements.filter((achievement) => {
    if (selectedFilter === "all") return true;
    const parts = achievement.title.split(" - ");
    return parts[0].trim() === selectedFilter;
  });

  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAchievements = filteredAchievements.slice(startIndex, endIndex);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/achievements", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      });
      const data = await response.json();
      setAchievements(data);
    } catch {
      toast.error("Failed to fetch achievements");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/achievements/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();

      // Get file name without extension and format it
      const fileName = file.name.split(".")[0];
      const formattedTitle = fileName
        .split(/[-_]/) // Split by hyphen or underscore
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize each word
        .join(" "); // Join with spaces

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
        title: formattedTitle,
      }));
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/achievements?id=${formData._id}`
        : "/api/achievements";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save data");
      }

      const result = await response.json();
      console.log("Server response:", result);

      toast.success(
        isEditing
          ? "Achievement updated successfully"
          : "Achievement created successfully"
      );
      setIsEditing(false);
      setIsDialogOpen(false);
      setFormData({
        imageUrl: "",
        title: "",
      });
      fetchAchievements();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save achievement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/achievements?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete achievement");

      toast.success("Achievement deleted successfully");
      fetchAchievements();
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete achievement");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (data: Achievement) => {
    setFormData(data);
    setIsEditing(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const openFormDialog = () => {
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      imageUrl: "",
      title: "",
    });
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  return {
    // State
    achievements,
    isEditing,
    isUploading,
    isDialogOpen,
    isDeleteDialogOpen,
    deleteId,
    selectedFilter,
    fileInputRef,
    formData,
    isLoading,
    isDeleting,
    isSubmitting,
    currentPage,
    itemsPerPage,
    currentAchievements,
    totalPages,
    getFilterOptions,

    // Actions
    setSelectedFilter,
    setFormData,
    setCurrentPage,
    handleImageUpload,
    handleSubmit,
    handleDelete,
    handleEdit,
    openDeleteDialog,
    openFormDialog,
    closeFormDialog,
    closeDeleteDialog,
    fetchAchievements,
  };
};
