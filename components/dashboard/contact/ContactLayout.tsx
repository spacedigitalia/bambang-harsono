'use client'

import React, { useState, useEffect } from 'react'

import { Card, CardContent } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'

import { Label } from '@/components/ui/label'

import {
    Mail,
    Calendar,
    User,
    ChevronRight,
    Eye,
    Trash2,
    CheckCircle,
    Reply,
    Send,
    X,
    AlertCircle,
} from 'lucide-react'

import { useAuth } from '@/utils/context/AuthContext'

export default function ContactPage() {
    const { user } = useAuth()
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyData, setReplyData] = useState({
        adminEmail: '',
        replyMessage: ''
    })
    const [isSendingReply, setIsSendingReply] = useState(false)
    const [replyStatus, setReplyStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [replyMessage, setReplyMessage] = useState('')


    useEffect(() => {
        fetchContacts()
        // Load saved admin email from localStorage
        const savedEmail = localStorage.getItem('adminEmail')
        if (savedEmail) {
            setReplyData(prev => ({ ...prev, adminEmail: savedEmail }))
        }
    }, [])

    // Override with logged-in user's email when available
    useEffect(() => {
        if (user?.email) {
            setReplyData(prev => ({ ...prev, adminEmail: user.email }))
        }
    }, [user])

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contact')
            if (response.ok) {
                const data = await response.json()
                setContacts(data.contacts)
            }
        } catch (error) {
            console.error('Error fetching contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateContactStatus = async (contactId: string, status: 'read' | 'replied') => {
        try {
            const response = await fetch(`/api/contact/${contactId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            })

            if (response.ok) {
                setContacts(prev =>
                    prev.map(contact =>
                        contact._id === contactId
                            ? { ...contact, status }
                            : contact
                    )
                )
            }
        } catch (error) {
            console.error('Error updating contact status:', error)
        }
    }

    const deleteContact = async (contactId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            const response = await fetch(`/api/contact/${contactId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setContacts(prev => prev.filter(contact => contact._id !== contactId))
                if (selectedContact?._id === contactId) {
                    setShowDialog(false)
                    setSelectedContact(null)
                }
            }
        } catch (error) {
            console.error('Error deleting contact:', error)
        }
    }

    const sendReply = async () => {
        if (!selectedContact || !replyData.adminEmail || !replyData.replyMessage) {
            setReplyStatus('error')
            setReplyMessage('Please fill in all fields')
            return
        }

        setIsSendingReply(true)
        setReplyStatus('idle')

        try {
            const response = await fetch('/api/contact/send-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactId: selectedContact._id,
                    adminEmail: replyData.adminEmail,
                    replyMessage: replyData.replyMessage
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setReplyStatus('success')
                setReplyMessage(data.message || 'Reply sent successfully!')

                // Save admin email to localStorage
                localStorage.setItem('adminEmail', replyData.adminEmail)

                // Update contact status in the list
                setContacts(prev =>
                    prev.map(contact =>
                        contact._id === selectedContact._id
                            ? { ...contact, status: 'replied' }
                            : contact
                    )
                )

                // Reset form but keep admin email
                setReplyData(prev => ({
                    adminEmail: prev.adminEmail,
                    replyMessage: ''
                }))

                // Close reply form after 2 seconds
                setTimeout(() => {
                    setShowReplyForm(false)
                    setReplyStatus('idle')
                    setReplyMessage('')
                }, 2000)
            } else {
                setReplyStatus('error')
                setReplyMessage(data.error || 'Failed to send reply. Please try again.')
            }
        } catch (error) {
            console.error('Send reply error:', error)
            setReplyStatus('error')
            setReplyMessage('Network error. Please check your connection and try again.')
        } finally {
            setIsSendingReply(false)
        }
    }

    const resetReplyForm = () => {
        setReplyData(prev => ({
            adminEmail: prev.adminEmail, // Keep admin email
            replyMessage: ''
        }))
        setReplyStatus('idle')
        setReplyMessage('')
        setShowReplyForm(false)
    }

    const getStatusBadge = (status: string) => {
        const variants = {
            unread: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
            read: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
            replied: 'bg-green-100 text-green-800 hover:bg-green-100'
        }
        return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <section>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-8 border rounded-2xl border-border bg-card shadow-sm mb-8 gap-4 sm:gap-0'>
                <div className='flex flex-col gap-4'>
                    <h3 className='text-3xl sm:text-4xl font-bold'>
                        Contact Messages
                    </h3>

                    <ol className='flex flex-wrap gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Pages</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>About</span>
                        </li>
                    </ol>
                </div>

                <Button
                    variant="default"
                    className="px-8 py-3 font-medium shadow-sm hover:shadow-md transition-all bg-primary hover:bg-primary/90"
                    onClick={fetchContacts}
                >
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {contacts.length === 0 ? (
                    <Card className="shadow-md rounded-2xl border border-border bg-card">
                        <CardContent className="p-8 text-center">
                            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                            <p className="text-muted-foreground">
                                Contact form submissions will appear here
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    contacts.map((contact) => (
                        <Card
                            key={contact._id}
                            className="transition-all duration-200 shadow-sm hover:shadow-lg border border-border rounded-2xl bg-card group"
                        >
                            <CardContent className="p-6 flex flex-col h-full justify-between">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-semibold text-lg line-clamp-1 text-foreground">
                                        {contact.subject}
                                    </h3>
                                    <Badge className={`px-2 py-0.5 text-xs font-semibold rounded-lg shadow-sm border ${getStatusBadge(contact.status)}`}>
                                        {contact.status}
                                    </Badge>
                                </div>
                                {/* Info Bar */}
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        {contact.name}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        {contact.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(contact.createdAt)}
                                    </span>
                                </div>
                                {/* Message Preview */}
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                                    {contact.message}
                                </p>
                                {/* Footer Actions */}
                                <div className="flex gap-2 mt-auto">
                                    <Button
                                        size="sm"
                                        className="flex-1 font-semibold"
                                        onClick={() => {
                                            setSelectedContact(contact)
                                            setShowDialog(true)
                                        }}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                    </Button>
                                    {contact.status !== 'replied' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                setSelectedContact(contact)
                                                setShowReplyForm(true)
                                            }}
                                        >
                                            <Reply className="w-4 h-4 mr-1" />
                                            Reply
                                        </Button>
                                    )}
                                    {contact.status === 'unread' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="flex-1"
                                            onClick={() => updateContactStatus(contact._id, 'read')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Mark Read
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="flex-1 text-destructive hover:bg-destructive/10"
                                        onClick={() => deleteContact(contact._id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Contact Detail Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-8  border border-border rounded-2xl shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold flex items-center gap-3 mb-2">
                            Message Details
                            {selectedContact && (
                                <Badge className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-lg shadow-sm border ${getStatusBadge(selectedContact.status)}`}>{selectedContact.status}</Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedContact && (
                        <div className="space-y-8">
                            {/* Info Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-muted-foreground/10">
                                <div>
                                    <h3 className="font-semibold text-xl text-foreground mb-1">{selectedContact.subject}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {selectedContact.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {selectedContact.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(selectedContact.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Message Section */}
                            <div>
                                <h4 className="font-medium mb-2 text-muted-foreground">Message:</h4>
                                <div className="bg-muted/60 p-6 rounded-xl border border-border">
                                    <p className="whitespace-pre-wrap text-base text-foreground">{selectedContact.message}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 pt-2 border-t border-muted-foreground/10">
                                <Button
                                    variant="outline"
                                    className="flex-1 min-w-[120px]"
                                    onClick={() => {
                                        setShowDialog(false)
                                        setShowReplyForm(true)
                                    }}
                                >
                                    <Reply className="w-4 h-4 mr-2" />
                                    Reply via Form
                                </Button>

                                <Button
                                    variant="outline"
                                    className="flex-1 min-w-[120px]"
                                    onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`)}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Reply via Email
                                </Button>

                                {selectedContact.status === 'unread' && (
                                    <Button
                                        variant="outline"
                                        className="flex-1 min-w-[120px]"
                                        onClick={() => {
                                            updateContactStatus(selectedContact._id, 'read')
                                            setShowDialog(false)
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark as Read
                                    </Button>
                                )}

                                <Button
                                    variant="destructive"
                                    className="flex-1 min-w-[120px]"
                                    onClick={() => {
                                        deleteContact(selectedContact._id)
                                        setShowDialog(false)
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Message
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reply Form Dialog */}
            <Dialog open={showReplyForm} onOpenChange={setShowReplyForm}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center justify-between">
                            Send Reply
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetReplyForm}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedContact && (
                        <div className="space-y-6">
                            {/* Original Message Preview */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Replying to: {selectedContact.subject}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {selectedContact.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {selectedContact.email}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Original Message:</h4>
                                    <div className="bg-muted p-4 rounded-lg">
                                        <p className="whitespace-pre-wrap text-sm">{selectedContact.message}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Message */}
                            {replyStatus !== 'idle' && (
                                <div className={`p-4 rounded-lg flex items-center gap-2 ${replyStatus === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                    }`}>
                                    {replyStatus === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className="text-sm font-medium">{replyMessage}</span>
                                </div>
                            )}

                            {/* Reply Form */}
                            <form onSubmit={(e) => { e.preventDefault(); sendReply(); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="adminEmail">Your Email Address</Label>
                                    <Input
                                        id="adminEmail"
                                        type="email"
                                        placeholder="your-email@example.com"
                                        value={replyData.adminEmail}
                                        onChange={(e) => setReplyData(prev => ({ ...prev, adminEmail: e.target.value }))}
                                        required
                                        disabled={isSendingReply}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        This email will be saved for future replies
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="replyMessage">Reply Message</Label>
                                    <Textarea
                                        id="replyMessage"
                                        placeholder="Type your reply here..."
                                        value={replyData.replyMessage}
                                        onChange={(e) => setReplyData(prev => ({ ...prev, replyMessage: e.target.value }))}
                                        rows={6}
                                        required
                                        disabled={isSendingReply}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={isSendingReply}
                                    >
                                        {isSendingReply ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Send className="w-4 h-4" />
                                                Send Reply
                                            </div>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetReplyForm}
                                        disabled={isSendingReply}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    )
} 