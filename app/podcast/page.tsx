"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Search, Play, Pause, SkipBack, SkipForward, MessageSquare } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { podcastEpisodes } from '@/lib/constants'
import { PodcastEpisode } from '@/lib/types'

export default function PodcastPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const filteredEpisodes = podcastEpisodes.filter(episode =>
    episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    episode.guest?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    episode.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode)
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Episode List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search episodes by title, guest, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Episodes */}
              <div className="space-y-4">
                {filteredEpisodes.length > 0 ? (
                  filteredEpisodes.map((episode) => (
                    <PodcastEpisodeCard
                      key={episode.id}
                      episode={episode}
                      isCurrentEpisode={currentEpisode?.id === episode.id}
                      onPlay={() => handlePlayEpisode(episode)}
                    />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No episodes found matching "{searchQuery}"
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Podcast Player */}
              <PodcastPlayer 
                episode={currentEpisode} 
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
              />

              {/* Syntax AI Card */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Exclusive Guest Perk: Syntax AI</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Chat with our LLM trained on all podcast content. Get instant insights from every conversation.
                    </p>
                    <Button size="sm" variant="outline">
                      Contact us about being a guest
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Content Protection Notice */}
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Content Protection Notice</h3>
                <p className="text-sm text-muted-foreground">
                  This content is proprietary and not intended for external AI training or reproduction without permission.
                </p>
              </Card>
            </div>
          </div>
        </div>

        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl font-heading">
          PMF Podcast Hub
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Exclusive GTM intelligence from founders, investors, and industry experts that powers our AI insights.
        </p>
      </div>
    </section>
  )
}

interface PodcastEpisodeCardProps {
  episode: PodcastEpisode
  isCurrentEpisode: boolean
  onPlay: () => void
}

function PodcastEpisodeCard({ episode, isCurrentEpisode, onPlay }: PodcastEpisodeCardProps) {
  return (
    <Card className={`p-6 ${isCurrentEpisode ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Image
            src={episode.imageUrl}
            alt={episode.title}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{episode.title}</h3>
          {episode.guest && (
            <p className="text-sm font-medium text-primary mb-2">with {episode.guest}</p>
          )}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{episode.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{episode.duration}</span>
            <Button size="sm" onClick={onPlay} variant={isCurrentEpisode ? "primary" : "outline"}>
              <Play className="h-4 w-4 mr-1" />
              {isCurrentEpisode ? 'Playing' : 'Play'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface PodcastPlayerProps {
  episode: PodcastEpisode | null
  isPlaying: boolean
  onPlayPause: () => void
}

function PodcastPlayer({ episode, isPlaying, onPlayPause }: PodcastPlayerProps) {
  if (!episode) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p className="mb-2">No episode selected</p>
          <p className="text-sm">Select an episode to start listening</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 sticky top-20">
      <div className="space-y-4">
        <div className="flex gap-4">
          <Image
            src={episode.imageUrl}
            alt={episode.title}
            width={60}
            height={60}
            className="rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-semibold line-clamp-2 mb-1">{episode.title}</h3>
            {episode.guest && (
              <p className="text-sm text-muted-foreground">with {episode.guest}</p>
            )}
            <p className="text-sm text-muted-foreground">{episode.duration}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button size="sm" variant="ghost">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={onPlayPause}>
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button size="sm" variant="ghost">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 bg-muted rounded-full">
            <div className="h-2 bg-primary rounded-full w-1/3" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>12:34</span>
            <span>{episode.duration}</span>
          </div>
        </div>

        {/* Episode Description */}
        <div>
          <h4 className="font-medium mb-2">Episode Description</h4>
          <p className="text-sm text-muted-foreground">{episode.description}</p>
        </div>
      </div>
    </Card>
  )
}

function NewsletterSection() {
  return (
    <section className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
          Don't Miss an Episode
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Get the latest GTM insights delivered to your inbox every week.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center max-w-md mx-auto">
          <Input 
            placeholder="Enter your email" 
            type="email"
            className="flex-1"
          />
          <Button>Subscribe</Button>
        </div>
      </div>
    </section>
  )
}