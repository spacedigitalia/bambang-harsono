 "use client"
 
 import { useEffect, useState } from "react"
 
 import { toast } from "sonner"
 
 export function useStateProject() {
   const [isOpen, setIsOpen] = useState(false)
   const [isDeleteOpen, setIsDeleteOpen] = useState(false)
   const [isViewOpen, setIsViewOpen] = useState(false)
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [isUploading, setIsUploading] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [isDeleting, setIsDeleting] = useState(false)
   const [deleteContentId, setDeleteContentId] = useState<string | undefined>(undefined)
   const [categories, setCategories] = useState<string[]>([])
   const [selectedCategory, setSelectedCategory] = useState<string>("all")
   const [searchQuery, setSearchQuery] = useState<string>("")
   const [frameworks, setFrameworks] = useState<Framework[]>([])
   const [projectsContent, setProjectsContent] = useState<projects[]>([])
   const [filteredProjects, setFilteredProjects] = useState<projects[]>([])
   const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 6
   const [isEditing, setIsEditing] = useState(false)
   const [formData, setFormData] = useState<projects>({
     _id: "",
     title: "",
     slug: "",
     description: "",
     content: "",
     category: "",
     thumbnail: "",
     imageUrl: [],
     previewLink: "",
     frameworks: [],
   })
   const [isLoading, setIsLoading] = useState(true)
   const [selectedProject, setSelectedProject] = useState<projects | null>(null)
 
   useEffect(() => {
     const fetchData = async () => {
       setIsLoading(true)
       try {
         const categoriesResponse = await fetch("/api/projects/categories", {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
           },
         })
         if (!categoriesResponse.ok) {
           throw new Error("Failed to fetch categories")
         }
         const categoriesData = (await categoriesResponse.json()) as string[]
         const uniqueCategories = [...new Set(categoriesData)]
         setCategories(uniqueCategories)
 
         const frameworksResponse = await fetch("/api/projects/frameworks", {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
           },
         })
         if (!frameworksResponse.ok) {
           throw new Error("Failed to fetch frameworks")
         }
         const frameworksData = (await frameworksResponse.json()) as Framework[]
         setFrameworks(frameworksData)
 
         const projectsResponse = await fetch("/api/projects", {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
           },
         })
         if (!projectsResponse.ok) {
           throw new Error("Failed to fetch Projects content")
         }
         const projectsData = (await projectsResponse.json()) as projects[]
         const sortedProjects = [...projectsData].sort((a, b) => {
           const dateA = new Date(a.createdAt || 0).getTime()
           const dateB = new Date(b.createdAt || 0).getTime()
           return dateB - dateA
         })
         setProjectsContent(sortedProjects)
       } catch (error) {
         toast.error(error instanceof Error ? error.message : "Failed to fetch data")
       } finally {
         setIsLoading(false)
       }
     }
 
     fetchData()
   }, [])
 
   useEffect(() => {
     let filtered = projectsContent
     if (selectedCategory !== "all") {
       filtered = filtered.filter((project) => project.category === selectedCategory)
     }
     if (searchQuery.trim()) {
       const query = searchQuery.toLowerCase().trim()
       filtered = filtered.filter((project) => project.title.toLowerCase().includes(query))
     }
     setFilteredProjects(filtered)
     setCurrentPage(1)
   }, [selectedCategory, searchQuery, projectsContent])
 
   const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
   const startIndex = (currentPage - 1) * itemsPerPage
   const endIndex = startIndex + itemsPerPage
   const currentProjects = filteredProjects.slice(startIndex, endIndex)
 
   const handlePageChange = (page: number) => {
     setCurrentPage(page)
   }
 
   const handleEdit = async (content: projects) => {
     try {
       const response = await fetch(`/api/projects/edit?id=${content._id}`, {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
         },
       })
       if (!response.ok) {
         throw new Error("Failed to fetch project edit")
       }
       const fullProjectData = (await response.json()) as projects
       setFormData({
         _id: fullProjectData._id,
         title: fullProjectData.title,
         slug: fullProjectData.slug,
         description: fullProjectData.description,
         content: fullProjectData.content,
         category: fullProjectData.category,
         thumbnail: fullProjectData.thumbnail,
         imageUrl: fullProjectData.imageUrl || [],
         previewLink: fullProjectData.previewLink || "",
         frameworks: fullProjectData.frameworks,
       })
       setIsEditing(true)
       setIsOpen(true)
     } catch (error) {
       toast.error(error instanceof Error ? error.message : "Failed to load project edit")
     }
   }
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     setIsSubmitting(true)
     try {
       const url = isEditing ? `/api/projects?id=${formData._id}` : "/api/projects"
       const method = isEditing ? "PUT" : "POST"
       const response = await fetch(url, {
         method,
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           ...(isEditing && { id: formData._id }),
           ...formData,
           frameworks: formData.frameworks.map((framework) => ({
             title: framework.title,
             imageUrl: framework.imageUrl,
           })),
         }),
       })
       if (!response.ok) {
         const errorData = await response.json()
         throw new Error(errorData.error || `Failed to ${isEditing ? "update" : "create"} content`)
       }
       const data = await response.json()
       if (isEditing) {
         setProjectsContent((prev) => prev.map((content) => (content._id === data._id ? data : content)))
       } else {
         setProjectsContent((prev) => [...prev, data])
       }
       toast.success(`Content ${isEditing ? "updated" : "created"} successfully`)
       setFormData({
         _id: "",
         title: "",
         slug: "",
         description: "",
         content: "",
         category: "",
         thumbnail: "",
         imageUrl: [],
         previewLink: "",
         frameworks: [],
       })
       setIsEditing(false)
       setIsOpen(false)
     } catch (error) {
       toast.error(error instanceof Error ? error.message : `Failed to ${isEditing ? "update" : "create"} content`)
     } finally {
       setIsSubmitting(false)
     }
   }
 
   const handleDeleteClick = (id: string | undefined) => {
     setDeleteContentId(id)
     setIsDeleteOpen(true)
   }
 
   const handleDelete = async () => {
     if (!deleteContentId) return
     setIsDeleting(true)
     try {
       const response = await fetch(`/api/projects?id=${deleteContentId}`, {
         method: "DELETE",
       })
       if (!response.ok) {
         throw new Error("Failed to delete content")
       }
       setProjectsContent((prev) => prev.filter((content) => content._id !== deleteContentId))
       toast.success("Content deleted successfully")
       setIsDeleteOpen(false)
       setDeleteContentId(undefined)
     } catch (error) {
       toast.error(error instanceof Error ? error.message : "Failed to delete content")
     } finally {
       setIsDeleting(false)
     }
   }
 
   const handleView = (content: projects) => {
     setSelectedProject(content)
     setIsViewOpen(true)
   }
 
   return {
     isOpen,
     setIsOpen,
     isDeleteOpen,
     setIsDeleteOpen,
     isViewOpen,
     setIsViewOpen,
     isUploading,
     isSubmitting,
     isDeleting,
     deleteContentId,
     setDeleteContentId,
     categories,
     selectedCategory,
     setSelectedCategory,
     searchQuery,
     setSearchQuery,
     frameworks,
     projectsContent,
     filteredProjects,
     currentPage,
     setCurrentPage,
     itemsPerPage,
     isEditing,
     setIsEditing,
     formData,
     setFormData,
     isLoading,
     selectedProject,
     setSelectedProject,
     totalPages,
     startIndex,
     endIndex,
     currentProjects,
     handlePageChange,
     handleEdit,
     handleSubmit,
     handleDeleteClick,
     handleDelete,
     handleView,
   }
 }

