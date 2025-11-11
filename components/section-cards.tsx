import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { fetchProjects } from "@/utils/fetching/FetchProjects"

import { fetchTechSkillsContents } from "@/utils/fetching/FetchTechSkills"

import { fetchGalleryContents } from "@/utils/fetching/FetchGallery"

import { fetchAchievementContents } from "@/utils/fetching/FetchAchievement"

export async function SectionCards() {
  const [projectsData, skillsData, galleryData, achievementsData] = await Promise.all([
    fetchProjects().catch(() => [] as projects[]),
    fetchTechSkillsContents().catch(() => [] as TechSkill[]),
    fetchGalleryContents().catch(() => [] as Gallery[]),
    fetchAchievementContents().catch(() => [] as Achievement[]),
  ])

  const projects = projectsData.length
  const skills = skillsData.length
  const gallery = galleryData.length
  const achievements = achievementsData.length

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {projects}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {projects > 0 ? "+" : ""}
              {projects}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total projects <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Jumlah project di database</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Skills</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {skills}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              {skills}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total skills <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Jumlah skills di database</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Gallery</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {gallery}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {gallery}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total gallery entries <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Jumlah data gallery</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Achievements</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {achievements}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {achievements}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total achievements <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Jumlah achievements di database</div>
        </CardFooter>
      </Card>
    </div>
  )
}

