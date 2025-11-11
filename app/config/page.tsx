'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR, { mutate } from 'swr'
import ImageUpload from '../../components/ImageUpload'
import MediaUpload from '../../components/MediaUpload'
import SocialNetworkManager from '../../components/SocialNetworkManager'
import CountryDepartmentSelector from '../../components/CountryDepartmentSelector'
import PostalCodeManager from '../../components/PostalCodeManager'
import CustomDepartmentManager from '../../components/CustomDepartmentManager'
import MaintenanceCountdown from '../../components/MaintenanceCountdown'
import ProductModal from '../../components/ProductModal'
import CategoryManager from '../../components/CategoryManager'
import { countriesData, getCountryDepartments } from '../../lib/countries-data'
import { 
  ChartBarIcon, 
  CogIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  BoltIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
  PhotoIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  ShoppingBagIcon,
  ChevronUpIcon,
      ChevronDownIcon,
      CubeIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
  WrenchIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TagIcon
} from '@heroicons/react/24/outline'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ConfigPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddPlug, setShowAddPlug] = useState(false)
  const [editingPlug, setEditingPlug] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [additionalLikes, setAdditionalLikes] = useState(0)
  
  // Form states
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [infoText, setInfoText] = useState('')
  const [globalMessage, setGlobalMessage] = useState('')
  const [miniAppButtonText, setMiniAppButtonText] = useState('PLUGS DU MOMENT 🔌')
  const [socialNetworks, setSocialNetworks] = useState<any>({})
  const [shopSocialNetworks, setShopSocialNetworks] = useState<any[]>([])
  const [tutoVideoUrl, setTutoVideoUrl] = useState('')
  const [tutoText, setTutoText] = useState('')
  
  // États pour la gestion des points
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [pointsToSend, setPointsToSend] = useState<number>(0)
  const [levelsToSend, setLevelsToSend] = useState<number>(0)
  const [pointsMessage, setPointsMessage] = useState<string>('')
  const [sendingPoints, setSendingPoints] = useState<boolean>(false)
  const [pointsHistory, setPointsHistory] = useState<any[]>([])
  const [showLevelOption, setShowLevelOption] = useState<boolean>(false)

  const [botSocialNetworks, setBotSocialNetworks] = useState<any[]>([])
  const [telegramChannelLink, setTelegramChannelLink] = useState('')
  const [telegramChannelId, setTelegramChannelId] = useState('')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceBackgroundImage, setMaintenanceBackgroundImage] = useState('')
  const [maintenanceLogo, setMaintenanceLogo] = useState('')
  const [maintenanceEndTime, setMaintenanceEndTime] = useState<Date | null>(null)
  const [maintenanceDuration, setMaintenanceDuration] = useState({ days: 0, hours: 1, minutes: 0 })
  const [editingApplication, setEditingApplication] = useState<any>(null)
  const [showEditApplication, setShowEditApplication] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newPlug, setNewPlug] = useState<{
    name: string
    photo: string
    socialNetworks: any
    customNetworks?: any[]
    methods: { delivery: boolean, shipping: boolean, meetup: boolean }
    deliveryDepartments: string[]
    deliveryPostalCodes: string[]
    meetupDepartments: string[]
    meetupPostalCodes: string[]
    countries: string[]
    shippingCountries?: string[]
    location: { country: string, department: string, postalCode: string, latitude?: number, longitude?: number }
    description: string
    referralLink?: string
  }>({
    name: '',
    photo: '',
    socialNetworks: {},
    customNetworks: [],
    methods: { delivery: false, shipping: false, meetup: false },
    deliveryDepartments: [],
    deliveryPostalCodes: [],
    meetupDepartments: [],
    meetupPostalCodes: [],
    countries: ['FR'],
          location: { country: 'FR', department: '', postalCode: '', latitude: undefined, longitude: undefined },
          description: '',
          referralLink: ''
        })
  
  const { data: stats } = useSWR(isAuthenticated ? '/api/stats' : null, fetcher)
  const { data: settings } = useSWR(isAuthenticated ? '/api/settings' : null, fetcher)
  const { data: plugs } = useSWR(isAuthenticated ? '/api/plugs?all=true' : null, fetcher)
  const { data: products } = useSWR(isAuthenticated ? '/api/products' : null, fetcher)
  const { data: applications } = useSWR(isAuthenticated ? '/api/applications' : null, fetcher)
  const { data: users = [], error: usersError } = useSWR(isAuthenticated ? '/api/users' : null, fetcher)
  
  useEffect(() => {
    console.log('Users data:', users)
    console.log('Users error:', usersError)
    console.log('Is authenticated:', isAuthenticated)
  }, [users, usersError, isAuthenticated])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const authStatus = localStorage.getItem('adminAuth')
        if (authStatus === 'true') {
          setIsAuthenticated(true)
        }
        
        // Check if desktop
        const checkDesktop = () => {
          setIsDesktop(window.innerWidth >= 1024)
        }
        
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        setIsLoading(false)
        return () => window.removeEventListener('resize', checkDesktop)
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsLoading(false)
      }
    }
  }, [])
  
  useEffect(() => {
    if (settings) {
      setWelcomeMessage(settings.welcomeMessage || '')
      setInfoText(settings.infoText || '')
      setMiniAppButtonText(settings.miniAppButtonText || 'NOS PLUGS DU MOMENT 🔌')
      setTutoVideoUrl(settings.tutoVideoUrl || '')
      setTutoText(settings.tutoText || '🤖 <b>TUTORIEL DU BOT</b>\n\nBienvenue dans notre bot de plugs certifiés!\n\nCe bot vous permet de:\n• 🔌 Découvrir des plugs certifiés\n• 🏅 Gagner des badges\n• 🗳️ Voter pour vos plugs favoris\n• 🏆 Participer aux classements\n• 💎 Débloquer des récompenses\n\nUtilisez les boutons du menu pour naviguer.')
      
      // Charger les réseaux sociaux du bot
      if (settings.botSocialNetworks) {
        setBotSocialNetworks(settings.botSocialNetworks)
      }
      
      // Charger la configuration Telegram
      if (settings.telegramChannelLink) {
        setTelegramChannelLink(settings.telegramChannelLink)
      }
      if (settings.telegramChannelId) {
        setTelegramChannelId(settings.telegramChannelId)
      }
      
      // Charger le mode maintenance
      if (settings.maintenanceMode !== undefined) {
        setMaintenanceMode(settings.maintenanceMode)
      }
      if (settings.maintenanceBackgroundImage !== undefined) {
        setMaintenanceBackgroundImage(settings.maintenanceBackgroundImage)
      }
      if (settings.maintenanceLogo !== undefined) {
        setMaintenanceLogo(settings.maintenanceLogo)
      }
      if (settings.maintenanceEndTime) {
        setMaintenanceEndTime(new Date(settings.maintenanceEndTime))
      }
      
      // Charger les réseaux sociaux de la boutique
      if (settings.shopSocialNetworks && settings.shopSocialNetworks.length > 0) {
        // S'assurer que chaque réseau a un ID
        const networksWithIds = settings.shopSocialNetworks.map((network: any, index: number) => ({
          ...network,
          id: network.id || `network-${index}-${Date.now()}`
        }))
        setShopSocialNetworks(networksWithIds)
      } else if (settings.socialNetworks) {
        console.log('Fallback sur socialNetworks:', settings.socialNetworks)
        // Fallback sur l'ancien format si shopSocialNetworks n'existe pas
        const networksArray = Object.entries(settings.socialNetworks).map(([key, value]: [string, any]) => ({
          id: key,
          name: value.name || key,
          emoji: value.emoji || '🔗',
          link: value.link || value.url || '',
          order: value.order || 0
        }))
        setShopSocialNetworks(networksArray)
      } else {
        console.log('Aucun réseau social trouvé')
      }
    }
  }, [settings])

  const getDefaultEmoji = (key: string) => {
    const emojis: any = {
      instagram: '📷',
      snapchat: '👻',
      telegram: '✈️',
      whatsapp: '💬',
      signal: '🔒',
      tiktok: '🎵'
    }
    return emojis[key] || '🔗'
  }


  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      if (res.ok) {
        setIsAuthenticated(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminAuth', 'true')
        }
        toast.success('Connexion réussie !')
      } else {
        toast.error('Mot de passe incorrect')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    }
  }
  
  const handleLogout = () => {
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAuth')
    }
    setPassword('')
    router.push('/')
  }
  
  const handleSendPoints = async () => {
    if (!selectedUserId || (pointsToSend <= 0 && levelsToSend <= 0)) {
      toast.error('Veuillez sélectionner un utilisateur et entrer des points ou des niveaux valides')
      return
    }

    setSendingPoints(true)
    try {
      const selectedUser = users && Array.isArray(users) ? users.find((u: any) => u._id === selectedUserId) : null
      
      let defaultMessage = ''
      if (pointsToSend > 0 && levelsToSend > 0) {
        defaultMessage = `🎁 JUNIOR vous a envoyé ${pointsToSend} points et ${levelsToSend} niveau${levelsToSend > 1 ? 'x' : ''} pour votre fidélité !\n\n💎 Ces points vous permettent d'acheter des badges exclusifs dans la boutique.\n🎖️ Les niveaux débloquent de nouveaux badges !\n\n📱 Faites /start pour voir les mises à jour et découvrir les nouveautés !`
      } else if (pointsToSend > 0) {
        defaultMessage = `🎁 JUNIOR vous a envoyé ${pointsToSend} points pour votre fidélité !\n\n💎 Ces points vous permettent d'acheter des badges exclusifs dans la boutique.\n\n📱 Faites /start pour voir les mises à jour et découvrir les nouveautés !`
      } else if (levelsToSend > 0) {
        defaultMessage = `🎖️ JUNIOR vous a fait monter de ${levelsToSend} niveau${levelsToSend > 1 ? 'x' : ''} !\n\n🆙 Vous avez désormais accès à de nouveaux badges dans la boutique.\n\n📱 Faites /start pour voir les mises à jour et découvrir les nouveautés !`
      }
      
      const message = pointsMessage || defaultMessage
      
      const response = await fetch('/api/users/send-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          points: pointsToSend,
          levels: levelsToSend,
          message: message,
          adminName: 'JUNIOR'
        })
      })

      if (response.ok) {
        let successMessage = ''
        if (pointsToSend > 0 && levelsToSend > 0) {
          successMessage = `${pointsToSend} points et ${levelsToSend} niveau${levelsToSend > 1 ? 'x' : ''} envoyés avec succès !`
        } else if (pointsToSend > 0) {
          successMessage = `${pointsToSend} points envoyés avec succès !`
        } else {
          successMessage = `${levelsToSend} niveau${levelsToSend > 1 ? 'x' : ''} envoyés avec succès !`
        }
        toast.success(successMessage)
        
        // Ajouter à l'historique
        setPointsHistory([
          {
            username: selectedUser?.username || selectedUser?.firstName || 'Utilisateur',
            points: pointsToSend,
            levels: levelsToSend,
            message: pointsMessage,
            date: new Date()
          },
          ...pointsHistory
        ])
        
        // Réinitialiser le formulaire
        setSelectedUserId('')
        setPointsToSend(0)
        setLevelsToSend(0)
        setPointsMessage('')
        setShowLevelOption(false)
        
        // Rafraîchir la liste des utilisateurs
        mutate('/api/users')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de l\'envoi')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de l\'envoi')
    } finally {
      setSendingPoints(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ welcomeMessage, infoText, miniAppButtonText, tutoVideoUrl, tutoText })
      })
      
      if (res.ok) {
        toast.success('Paramètres sauvegardés !')
        mutate('/api/settings')
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleSaveBotSocialNetworks = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botSocialNetworks })
      })
      
      if (res.ok) {
        toast.success('Réseaux sociaux du bot sauvegardés !')
        mutate('/api/settings')
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }
  
  const handleSendGlobalMessage = async () => {
    if (!globalMessage.trim()) {
      toast.error('Le message ne peut pas être vide')
      return
    }
    
    try {
      const res = await fetch('/api/messages/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: globalMessage })
      })
      
      if (res.ok) {
        const result = await res.json()
        toast.success(`Message envoyé ! ✅ ${result.sent} réussis, ❌ ${result.failed} échoués`)
        setGlobalMessage('')
      } else {
        const error = await res.json()
        toast.error(error.error || 'Erreur lors de l\'envoi')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi')
    }
  }
  
  const handleAddPlug = async () => {
    try {
      // Formater les données du plug
      const plugData = {
        ...newPlug,
        countries: newPlug.countries,
        country: newPlug.countries[0] || 'FR', // Rétrocompatibilité
        department: newPlug.location.department,
        postalCode: newPlug.location.postalCode,
        countryFlag: getCountryFlag(newPlug.countries[0] || 'FR'),
        likes: additionalLikes, // Ajouter les likes initiaux
        // Convertir customNetworks en socialNetworks pour la compatibilité
        socialNetworks: newPlug.customNetworks ? newPlug.customNetworks.reduce((acc: any, network: any) => {
          acc[network.name.toLowerCase()] = network.link
          return acc
        }, {}) : {}
      }
      
      const res = await fetch('/api/admin/plugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plugData)
      })
      
      if (res.ok) {
        toast.success('Plug ajouté avec succès !')
        setShowAddPlug(false)
        setAdditionalLikes(0) // Réinitialiser les likes
        setNewPlug({
          name: '',
          photo: '',
          socialNetworks: {},
          customNetworks: [],
          methods: { delivery: false, shipping: false, meetup: false },
          deliveryDepartments: [],
          deliveryPostalCodes: [],
          meetupDepartments: [],
          meetupPostalCodes: [],
          countries: ['FR'],
          location: { country: 'FR', department: '', postalCode: '', latitude: undefined, longitude: undefined },
          description: '',
          referralLink: ''
        })
        mutate('/api/plugs?all=true')
        mutate('/api/plugs')
        mutate('/api/stats')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout')
    }
  }
  
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'FR': '🇫🇷',
      'BE': '🇧🇪',
      'CH': '🇨🇭',
      'CA': '🇨🇦',
      'LU': '🇱🇺'
    }
    return flags[country] || '🌍'
  }

  const handleUpdatePlug = async () => {
    try {
      // Formater les données du plug
      const plugData = {
        ...editingPlug,
        likes: (editingPlug.likes || 0) + additionalLikes, // Ajouter les likes supplémentaires
        countryFlag: getCountryFlag(editingPlug.location?.country || editingPlug.country || 'FR'),
        // Convertir customNetworks en socialNetworks pour la compatibilité
        socialNetworks: editingPlug.customNetworks ? editingPlug.customNetworks.reduce((acc: any, network: any) => {
          acc[network.name.toLowerCase()] = network.link
          return acc
        }, {}) : editingPlug.socialNetworks || {}
      }
      
      const res = await fetch(`/api/plugs/${editingPlug._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plugData)
      })

      if (res.ok) {
        toast.success('Plug mis à jour avec succès !')
        setShowAddPlug(false)
        setEditingPlug(null)
        setAdditionalLikes(0) // Réinitialiser les likes
        mutate('/api/plugs?all=true')
        mutate('/api/plugs')
        mutate('/api/stats')
      } else {
        const error = await res.json()
        toast.error(error.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }
  
  const handleUpdateSocialNetwork = (key: string, value: string) => {
    setSocialNetworks({ ...socialNetworks, [key]: value })
  }

  const handleSaveSocialNetworks = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialNetworks })
      })
      
      if (res.ok) {
        toast.success('Réseaux sociaux mis à jour !')
        mutate('/api/settings')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleSaveTelegramConfig = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          telegramChannelLink,
          telegramChannelId 
        })
      })
      
      if (res.ok) {
        toast.success('Configuration Telegram mise à jour !')
        mutate('/api/settings')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }
  
  const handleToggleMaintenance = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          maintenanceMode: !maintenanceMode
        })
      })
      
      if (res.ok) {
        setMaintenanceMode(!maintenanceMode)
        toast.success(maintenanceMode ? 'Mode maintenance désactivé' : 'Mode maintenance activé')
        mutate('/api/settings')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleSaveShopSocialNetworks = async () => {
    try {
      console.log('Sauvegarde des réseaux sociaux:', shopSocialNetworks)
      
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          shopSocialNetworks: shopSocialNetworks
        })
      })

      if (res.ok) {
        toast.success('Réseaux sociaux sauvegardés')
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
            console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleDeletePlug = async (plugId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plug ?')) return
    
    try {
      const res = await fetch(`/api/plugs/${plugId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        toast.success('Plug supprimé !')
        mutate('/api/plugs?all=true')
        mutate('/api/plugs')
        mutate('/api/stats')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        toast.success('Produit supprimé !')
        mutate('/api/products')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }
  
  const handleApproveApplication = async (applicationId: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/approve`, {
        method: 'POST'
      })
      
      if (res.ok) {
        toast.success('Candidature approuvée !')
        mutate('/api/applications')
        mutate('/api/plugs?all=true')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'approbation')
    }
  }
  
  const handleRejectApplication = async (applicationId: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/reject`, {
        method: 'POST'
      })
      
      if (res.ok) {
        toast.success('Candidature rejetée')
        mutate('/api/applications')
      }
    } catch (error) {
      toast.error('Erreur lors du rejet')
    }
  }
  
  // Pas d'écran de chargement

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-md w-full p-8"
        >
          <h1 className="text-3xl font-bold mb-8 text-center gradient-text">
            Panel Admin
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe administrateur"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
              required
              autoFocus
            />
            
            <button type="submit" className="btn-primary w-full">
              Se connecter
            </button>
          </form>
          
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white transition-colors mt-4 flex items-center gap-2 mx-auto"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    )
  }
  
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: ChartBarIcon },
    { id: 'plugs', label: 'Plugs', icon: BoltIcon },
    { id: 'products', label: 'Produits', icon: ShoppingCartIcon },
    { id: 'categories', label: 'Catégories', icon: TagIcon },
    { id: 'applications', label: 'Candidatures', icon: DocumentTextIcon },
    { id: 'points', label: 'Points', icon: CurrencyDollarIcon },
    { id: 'social', label: 'Réseaux Sociaux', icon: ShareIcon },
    { id: 'telegram', label: 'Telegram', icon: ChatBubbleLeftIcon },
    { id: 'tuto', label: 'Tuto Bot', icon: PhotoIcon },
    { id: 'maintenance', label: 'Maintenance', icon: WrenchIcon },
    { id: 'settings', label: 'Paramètres', icon: CogIcon },
  ]
  
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Menu"
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Admin Panel</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <div className="flex relative">
        {/* Sidebar - Responsive */}
        {(mobileMenuOpen || isDesktop) && (
          <aside
            className={`
                fixed lg:sticky top-0 left-0 h-screen 
                w-72 sm:w-80 lg:w-64 xl:w-72
                bg-gray-900/95 backdrop-blur-md 
                border-r border-gray-800 
                z-40 shadow-2xl
                overflow-y-auto
                ${mobileMenuOpen ? 'pt-20 lg:pt-0' : ''}
              `}
            >
              <div className="p-4 sm:p-6">
                {/* Desktop Header */}
                <div className="hidden lg:block mb-8">
                  <h2 className="text-2xl xl:text-3xl font-black text-white mb-2">Admin Panel</h2>
                  <p className="text-gray-400 text-sm">Gestion de la boutique</p>
                </div>
                
                {/* Navigation */}
                <nav className="space-y-1 sm:space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setMobileMenuOpen(false)
                      }}
                      className={`
                        w-full flex items-center gap-3 
                        px-3 sm:px-4 py-2.5 sm:py-3 
                        rounded-lg sm:rounded-xl 
                        transition-all duration-200 
                        text-sm sm:text-base font-medium
                        ${activeTab === tab.id 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-[1.02]' 
                          : 'bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/50'
                        }
                      `}
                    >
                      <tab.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate text-white">{tab.label}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="
                    w-full mt-6 sm:mt-8 
                    px-3 sm:px-4 py-2.5 sm:py-3 
                    bg-red-600/90 hover:bg-red-600 
                    text-white rounded-lg sm:rounded-xl 
                    text-sm sm:text-base font-medium 
                    transition-all duration-200
                    flex items-center justify-center gap-2 
                    shadow-lg hover:shadow-red-500/20
                  "
                >
                  <ArrowLeftIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                  Déconnexion
                </button>
              </div>
            </aside>
          )}
        
        {/* Main Content - Responsive padding */}
        <main className="
          flex-1 
          w-full
          min-h-screen
          p-4 sm:p-6 lg:p-8 
          pt-20 lg:pt-8
          overflow-x-hidden
        ">
          <div>
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Tableau de bord</h1>
                  
                  {/* Stats Grid - Responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                      <div
                    className="glass-card p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <UserGroupIcon className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-2" />
                    <p className="text-gray-400 text-xs sm:text-sm">Utilisateurs</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stats?.userCount || 0}</p>
                  </div>
                  
                  <div
                    className="glass-card p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <BoltIcon className="w-6 sm:w-8 h-6 sm:h-8 text-green-500 mb-2" />
                    <p className="text-gray-400 text-xs sm:text-sm">Plugs actifs</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stats?.plugCount || 0}</p>
                  </div>
                  
                  <div
                    className="glass-card p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <HeartIcon className="w-6 sm:w-8 h-6 sm:h-8 text-red-500 mb-2" />
                    <p className="text-gray-400 text-xs sm:text-sm">Total likes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {plugs?.reduce((acc: number, plug: any) => acc + plug.likes, 0) || 0}
                    </p>
                  </div>
                  
                  <div
                    className="glass-card p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <DocumentTextIcon className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500 mb-2" />
                    <p className="text-gray-400 text-xs sm:text-sm">Candidatures</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {applications?.filter((a: any) => a.status === 'pending').length || 0}
                    </p>
                  </div>
                  </div>
                  
                  {/* Splash Screen Controls */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Contrôle du Splash Screen</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          try {
                            await fetch('/api/splash', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'force' })
                            })
                            toast.success('Splash screen forcé ! Rafraîchissez la page pour le voir.')
                          } catch (error) {
                            toast.error('Erreur lors du forçage du splash screen')
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Forcer le Splash Screen
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await fetch('/api/splash', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ action: 'reset' })
                            })
                            toast.success('Splash screen réinitialisé !')
                          } catch (error) {
                            toast.error('Erreur lors de la réinitialisation')
                          }
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Réinitialiser
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Utilisez ces boutons pour tester le splash screen d'entrée
                    </p>
                  </div>
                  
                  {/* Top Plugs */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white text-white mb-4">🏆 Top Plugs</h2>
                    <div className="space-y-3">
                      {plugs?.slice(0, 5).map((plug: any, index: number) => (
                        <div key={plug._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {index === 0 && '🥇'}
                              {index === 1 && '🥈'}
                              {index === 2 && '🥉'}
                              {index > 2 && `${index + 1}.`}
                            </span>
                            <div>
                              <p className="font-semibold text-white">{plug.name}</p>
                              <p className="text-sm text-gray-400">
                                {plug.location?.department || plug.department || ''} • {plug.likes || 0} likes
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {plug.referralCount || 0} parrainages
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Top Parrains */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">👥 Top Parrains</h2>
                    <div className="space-y-3">
                      {plugs?.sort((a: any, b: any) => (b.referralCount || 0) - (a.referralCount || 0))
                        .slice(0, 5)
                        .map((plug: any, index: number) => (
                          <div key={plug._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {index === 0 && '🥇'}
                                {index === 1 && '🥈'}
                                {index === 2 && '🥉'}
                                {index > 2 && `${index + 1}.`}
                              </span>
                              <div>
                                <p className="font-semibold text-white">{plug.name}</p>
                                <p className="text-sm text-gray-400">
                                  {plug.location?.department || plug.department || ''}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-blue-400">
                              {plug.referralCount || 0} parrainages
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Plugs Management */}
              {activeTab === 'plugs' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Gestion des Plugs</h1>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={async () => {
                          const confirmed = window.confirm('Voulez-vous vraiment ajouter 50 likes à TOUS les plugs ?')
                          if (!confirmed) return
                          
                          try {
                            const res = await fetch('/api/admin/plugs/add-likes', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'defaultadminpassword'}`
                              },
                              body: JSON.stringify({ likesToAdd: 50 })
                            })
                            
                            if (res.ok) {
                              const data = await res.json()
                              toast.success(data.message)
                              mutate('/api/plugs?all=true') // Rafraîchir la liste
                            } else {
                              toast.error('Erreur lors de l\'ajout des likes')
                            }
                          } catch (error) {
                            toast.error('Erreur lors de l\'ajout des likes')
                          }
                        }}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <HeartIcon className="w-5 h-5" />
                        +50 ❤️ à tous
                      </button>
                      <button
                        onClick={() => setShowAddPlug(true)}
                        className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 py-3"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Ajouter un plug
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {plugs?.map((plug: any) => (
                      <motion.div
                        key={plug._id}
                        whileHover={{ scale: 1.01 }}
                        className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          {plug.photo && (
                            <img
                              src={plug.photo}
                              alt={plug.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-bold text-white text-lg">{plug.name}</h3>
                            <p className="text-sm text-gray-400">
                              {plug.location?.country || plug.country || 'FR'} - {plug.location?.department || plug.department || ''} • 
                              ❤️ {plug.likes || 0} • 🔗 {plug.referralCount || 0}
                            </p>
                            <div className="flex gap-2 mt-1">
                              {plug.methods?.delivery && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">🚚 Livraison</span>}
                              {plug.methods?.shipping && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">📮 Envoi</span>}
                              {plug.methods?.meetup && <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">🤝 Meetup</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => {
                              const link = plug.referralLink || `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME || 'PLGSCRTF_BOT'}?start=plug_${plug._id}`
                              navigator.clipboard.writeText(link)
                              toast.success('Lien de parrainage copié !')
                            }}
                            className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white transition-all flex items-center gap-1"
                          >
                            🔗 Copier lien
                          </button>
                          <button
                            onClick={() => {
                              // Convertir socialNetworks en customNetworks si nécessaire
                              const plugToEdit = {...plug}
                              // Initialiser countries si pas présent
                              if (!plugToEdit.countries || plugToEdit.countries.length === 0) {
                                plugToEdit.countries = plugToEdit.country ? [plugToEdit.country] : ['FR']
                              }
                              if (!plugToEdit.customNetworks) {
                                plugToEdit.customNetworks = []
                              }
                              // Convertir socialNetworks en customNetworks seulement s'il n'y a pas déjà de customNetworks
                              if (plugToEdit.customNetworks.length === 0 && plugToEdit.socialNetworks) {
                                const networkMap: any = {
                                  snap: { name: 'Snapchat', emoji: '👻' },
                                  instagram: { name: 'Instagram', emoji: '📷' },
                                  whatsapp: { name: 'WhatsApp', emoji: '💬' },
                                  telegram: { name: 'Telegram', emoji: '✈️' },
                                  signal: { name: 'Signal', emoji: '🔒' },
                                  threema: { name: 'Threema', emoji: '🔐' },
                                  potato: { name: 'Potato', emoji: '🥔' }
                                }
                                Object.entries(plugToEdit.socialNetworks).forEach(([key, value]) => {
                                  if (value && networkMap[key]) {
                                    plugToEdit.customNetworks.push({
                                      id: Date.now().toString() + Math.random(),
                                      name: networkMap[key].name,
                                      emoji: networkMap[key].emoji,
                                      link: value as string
                                    })
                                  }
                                })
                                // Effacer socialNetworks après conversion pour éviter la duplication
                                plugToEdit.socialNetworks = {}
                              }
                              setEditingPlug(plugToEdit)
                              setAdditionalLikes(0) // Réinitialiser les likes à 0 lors de l'édition
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePlug(plug._id)}
                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Products */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Produits</h1>
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 py-3"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Ajouter un produit
                    </button>
                  </div>
                  
                  {!products ? (
                    <div className="glass-card p-8 text-center">
                      <p className="text-gray-400">Chargement des produits...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                      <p className="text-gray-400">Aucun produit pour le moment</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {products.map((product: any) => (
                        <div
                          key={product._id}
                          className="glass-card p-6 hover:border-primary/50 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-white text-lg">{product.name}</h3>
                              <p className="text-gray-400 mt-1">{product.description}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  product.inStock ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                }`}>
                                  {product.inStock ? 'En stock' : 'Rupture'}
                                </span>
                                {product.featured && (
                                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">
                                    Vedette
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product)
                                  setShowAddProduct(true)
                                }}
                                className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Categories */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <CategoryManager />
                </div>
              )}
              
              {/* Applications */}
              {activeTab === 'applications' && (
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-white">Candidatures Vendeurs</h1>
                  
                  {!applications ? (
                    <div className="glass-card p-8 text-center">
                      <p className="text-gray-400">Chargement des candidatures...</p>
                    </div>
                  ) : applications.filter((a: any) => a.status === 'pending').length === 0 ? (
                    <div className="glass-card p-8 text-center">
                      <p className="text-gray-400">Aucune candidature en attente</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {applications.filter((a: any) => a.status === 'pending').map((app: any) => {
                        try {
                        // Vérifier et normaliser les données
                        const safeApp = {
                          ...app,
                          socialNetworks: app.socialNetworks || { primary: [], others: '' },
                          methods: app.methods || {},
                          country: app.country || app.location?.country || '',
                          department: app.department || app.location?.department || '',
                          postalCode: app.postalCode || app.location?.postalCode || ''
                        }
                        
                        return (
                          <motion.div
                            key={app._id}
                            whileHover={{ scale: 1.01 }}
                            className="glass-card p-6"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-white text-lg">@{app.username || 'Utilisateur'}</h3>
                                <p className="text-sm text-gray-400">
                                  Candidature du {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Date inconnue'}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingApplication(app)
                                    setShowEditApplication(true)
                                  }}
                                  className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30 transition-colors"
                                  title="Modifier"
                                >
                                  <PencilIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleApproveApplication(app._id)}
                                  className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                                  title="Approuver"
                                >
                                  <CheckIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleRejectApplication(app._id)}
                                  className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                                  title="Rejeter"
                                >
                                  <XMarkIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          
                          <div className="space-y-4">
                            {/* Photo de la boutique */}
                            {(safeApp.photo || safeApp.shopPhoto) && (
                              <div className="mb-4">
                                <p className="text-gray-400 mb-2">📸 Photo de la boutique:</p>
                                <div className="bg-gray-800 p-2 rounded-lg inline-block">
                                  <p className="text-xs text-gray-400 mb-1">Photo ID: {safeApp.photo || safeApp.shopPhoto}</p>
                                  <p className="text-xs text-gray-400">La photo est stockée sur Telegram</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Réseaux sociaux */}
                            <div className="bg-white/5 p-3 rounded-lg">
                              <p className="text-gray-400 font-semibold mb-2">📱 Réseaux sociaux:</p>
                              {safeApp.socialNetworks?.primary?.length > 0 ? (
                                <div className="space-y-2">
                                  {safeApp.socialNetworks.primary.map((network: string, idx: number) => {
                                    const networkNames: any = {
                                      snap: '👻 Snapchat',
                                      instagram: '📸 Instagram',
                                      whatsapp: '💬 WhatsApp',
                                      signal: '🔐 Signal',
                                      threema: '🔒 Threema',
                                      potato: '🥔 Potato',
                                      telegram: '✈️ Telegram'
                                    };
                                    const link = safeApp.socialNetworks?.links?.[network] || 'Pas de lien';
                                    return (
                                      <div key={`${network}-${idx}`} className="flex items-center justify-between bg-gray-800/50 p-2 rounded-lg">
                                        <span className="text-sm font-medium text-white">
                                          {networkNames[network] || network}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-2 truncate max-w-[200px]">
                                          {link}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-gray-400 italic">Non spécifié</p>
                              )}
                              {safeApp.socialNetworks?.others && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                  <p className="text-sm text-white">
                                    <span className="text-gray-400 font-medium">Autres réseaux:</span>
                                  </p>
                                  <p className="text-sm text-white mt-1">{safeApp.socialNetworks.others}</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Méthodes et zones */}
                            <div className="bg-white/5 p-3 rounded-lg">
                              <p className="text-gray-400 font-semibold mb-2">📦 Méthodes de vente:</p>
                              <div className="space-y-2">
                                {safeApp.methods?.delivery && (
                                  <div>
                                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                                      🚚 Livraison
                                    </span>
                                    {safeApp.deliveryZones && (
                                      <p className="text-sm text-white mt-1 ml-2">Zones: {safeApp.deliveryZones || 'Non spécifié'}</p>
                                    )}
                                  </div>
                                )}
                                {safeApp.methods?.shipping && (
                                  <div>
                                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                                      📮 Envoi
                                    </span>
                                    {safeApp.shippingZones && (
                                      <p className="text-sm text-white mt-1 ml-2">Zones: {safeApp.shippingZones || 'Non spécifié'}</p>
                                    )}
                                  </div>
                                )}
                                {safeApp.methods?.meetup && (
                                  <div>
                                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                                      🤝 Meetup
                                    </span>
                                    {safeApp.meetupZones && (
                                      <p className="text-sm text-white mt-1 ml-2">Zones: {safeApp.meetupZones || 'Non spécifié'}</p>
                                    )}
                                  </div>
                                )}
                                {!safeApp.methods?.delivery && !safeApp.methods?.shipping && !safeApp.methods?.meetup && (
                                  <p className="text-gray-400 italic">Aucune méthode sélectionnée</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Localisation */}
                            <div className="bg-white/5 p-3 rounded-lg">
                              <p className="text-gray-400 font-semibold mb-2">📍 Localisation:</p>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <p className="text-gray-400">Pays:</p>
                                  <p className="text-white">{safeApp.country || 'Non spécifié'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Département:</p>
                                  <p className="text-white">{safeApp.department || 'Non spécifié'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Code postal:</p>
                                  <p className="text-white">{safeApp.postalCode || 'Non spécifié'}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Description */}
                            <div className="bg-white/5 p-3 rounded-lg">
                              <p className="text-gray-400 font-semibold mb-2">📝 Description:</p>
                              <p className="text-sm text-white">{safeApp.description || <span className="text-gray-400 italic">Non spécifié</span>}</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    } catch (error) {
                      console.error('Error rendering application:', app._id, error)
                      return (
                        <div key={app._id} className="glass-card p-6 text-center">
                          <p className="text-red-400">Erreur lors de l'affichage de cette candidature</p>
                        </div>
                      )
                    }
                  })}
                    </div>
                  )}
                </div>
              )}
              

              
              {/* Social Networks */}
              {activeTab === 'social' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Réseaux Sociaux de la Boutique</h1>
                  </div>
                  
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Gérer les réseaux sociaux de la boutique</h2>
                    <p className="text-gray-400 mb-6">
                      Configurez les liens vers vos réseaux sociaux qui seront affichés sur la page publique.
                    </p>
                    
                    <SocialNetworkManager 
                      networks={shopSocialNetworks}
                      onChange={(networks) => {
                        setShopSocialNetworks(networks)
                      }}
                    />
                    
                    <button
                      onClick={handleSaveShopSocialNetworks}
                      className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="w-5 h-5" />
                      Sauvegarder les réseaux sociaux
                    </button>
                  </div>
                </div>
              )}
              
              {/* Telegram Configuration */}
              {activeTab === 'telegram' && (
                <div className="space-y-6 max-w-4xl">
                  <h1 className="text-3xl font-bold text-white">Configuration Telegram</h1>
                  
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Canal de vérification</h2>
                    <p className="text-gray-400 mb-6">
                      Configurez le canal Telegram que les utilisateurs doivent rejoindre pour accéder au bot.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Lien d'invitation du canal
                        </label>
                        <input
                          type="text"
                          value={telegramChannelLink}
                          onChange={(e) => setTelegramChannelLink(e.target.value)}
                          placeholder="https://t.me/+RoI-Xzh-ma9iYmY0"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Le lien d'invitation que les utilisateurs utiliseront pour rejoindre le canal
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          ID du canal
                        </label>
                        <input
                          type="text"
                          value={telegramChannelId}
                          onChange={(e) => setTelegramChannelId(e.target.value)}
                          placeholder="-1002736254394"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          L'ID numérique du canal (format: -100xxxxxxxxxx)
                        </p>
                      </div>
                      
                      <button
                        onClick={handleSaveTelegramConfig}
                        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckIcon className="w-5 h-5" />
                        Sauvegarder la configuration
                      </button>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Comment obtenir l'ID du canal ?</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-400">
                      <li>Ajoutez votre bot comme administrateur du canal</li>
                      <li>Envoyez un message dans le canal</li>
                      <li>Allez sur : https://api.telegram.org/bot{'{'}votre_token{'}'}/getUpdates</li>
                      <li>Cherchez "chat":{"{"}"id":-100xxxxxxxxxx{"}"} dans la réponse</li>
                    </ol>
                  </div>
                </div>
              )}
              
              {/* Points */}
              {activeTab === 'points' && (
                <div className="space-y-6 max-w-4xl">
                  <h1 className="text-3xl font-bold text-white">💰 Gestion des Points</h1>
                  
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Envoyer des Points aux Utilisateurs</h2>
                    <p className="text-gray-400 mb-6">
                      Envoyez des points aux utilisateurs pour récompenser leur fidélité. Ces points peuvent être utilisés pour acheter des badges dans la boutique.
                    </p>
                    
                    {/* Sélection de l'utilisateur */}
                    <div className="mb-6">
                      <label className="block text-white mb-2">Sélectionner un utilisateur ({users.length} utilisateurs)</label>
                      <select
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                        value={selectedUserId || ''}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                      >
                        <option value="">Choisir un utilisateur...</option>
                        {users && Array.isArray(users) && users.length > 0 ? (
                          users.map((user: any) => (
                            <option key={user._id} value={user._id}>
                              {user.username || user.firstName || 'Utilisateur'} - {user.points || 0} points actuels
                            </option>
                          ))
                        ) : (
                          <option disabled>Chargement des utilisateurs...</option>
                        )}
                      </select>
                    </div>
                    
                    {/* Nombre de points */}
                    <div className="mb-6">
                      <label className="block text-white mb-2">Nombre de points à envoyer</label>
                      <input
                        type="number"
                        min="0"
                        value={pointsToSend}
                        onChange={(e) => setPointsToSend(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                        placeholder="Ex: 100"
                      />
                    </div>
                    
                    {/* Option pour ajouter des niveaux */}
                    <div className="mb-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showLevelOption}
                          onChange={(e) => setShowLevelOption(e.target.checked)}
                          className="w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                        />
                        <span className="text-white">Ajouter aussi des niveaux</span>
                      </label>
                    </div>
                    
                    {/* Nombre de niveaux */}
                    {showLevelOption && (
                      <div className="mb-6">
                        <label className="block text-white mb-2">Nombre de niveaux à ajouter</label>
                        <input
                          type="number"
                          min="1"
                          value={levelsToSend}
                          onChange={(e) => setLevelsToSend(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="Ex: 5"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Les niveaux permettent de débloquer de nouveaux badges dans la boutique
                        </p>
                      </div>
                    )}
                    
                    {/* Message personnalisé */}
                    <div className="mb-6">
                      <label className="block text-white mb-2">Message personnalisé (optionnel)</label>
                      <textarea
                        value={pointsMessage}
                        onChange={(e) => setPointsMessage(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                        rows={4}
                        placeholder="Ex: Merci pour votre fidélité ! Ces points vous permettent d'acheter des badges exclusifs..."
                      />
                    </div>
                    
                    {/* Bouton d'envoi */}
                    <button
                      onClick={handleSendPoints}
                      disabled={!selectedUserId || pointsToSend <= 0 || sendingPoints}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingPoints ? 'Envoi en cours...' : 'Envoyer les Points'}
                    </button>
                  </div>
                  
                  {/* Historique des envois */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Historique des Envois</h2>
                    <div className="space-y-4">
                      {pointsHistory.length > 0 ? (
                        pointsHistory.map((entry: any, index: number) => (
                          <div key={index} className="bg-white/5 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">
                                  {entry.username} - 
                                  {entry.points > 0 && `${entry.points} points`}
                                  {entry.points > 0 && entry.levels > 0 && ' + '}
                                  {entry.levels > 0 && `${entry.levels} niveau${entry.levels > 1 ? 'x' : ''}`}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {new Date(entry.date).toLocaleString('fr-FR')}
                                </p>
                                {entry.message && (
                                  <p className="text-gray-300 text-sm mt-2">{entry.message}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">Aucun envoi de points pour le moment</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tuto Bot */}
              {activeTab === 'tuto' && (
                <div className="space-y-6 max-w-4xl">
                  <h1 className="text-3xl font-bold text-white">🤖 Configuration du Tutoriel Bot</h1>
                  
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Vidéo du Tutoriel</h2>
                    <p className="text-gray-400 mb-6">
                      Ajoutez une vidéo tutoriel pour expliquer le fonctionnement du bot. Vous pouvez utiliser Cloudinary pour héberger votre vidéo.
                    </p>
                    
                    {/* Aperçu de la vidéo */}
                    {tutoVideoUrl && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Aperçu de la vidéo actuelle</h3>
                        <div className="rounded-lg overflow-hidden bg-gray-800">
                          {tutoVideoUrl.startsWith('http') ? (
                            <video 
                              controls 
                              className="w-full max-h-96"
                              src={tutoVideoUrl}
                            >
                              Votre navigateur ne supporte pas la vidéo.
                            </video>
                          ) : (
                            <div className="p-8 text-center text-gray-400">
                              <p>ID Telegram: {tutoVideoUrl}</p>
                              <p className="text-sm mt-2">La vidéo sera affichée dans le bot Telegram</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Upload de vidéo */}
                    <div className="mb-6">
                      <label className="block text-white mb-2">Vidéo du tutoriel</label>
                      
                      {/* Composant d'upload */}
                      <MediaUpload
                        onUpload={(url, type) => setTutoVideoUrl(url)}
                        currentMedia={tutoVideoUrl}
                        currentType={tutoVideoUrl?.includes('.mp4') || tutoVideoUrl?.includes('.mov') ? 'video' : 'image'}
                        label="Cliquez pour choisir une vidéo depuis votre galerie"
                        acceptVideo={true}
                      />
                      
                      {/* OU entrer une URL manuellement */}
                      <div className="mt-4">
                        <label className="block text-gray-400 text-sm mb-2">Ou entrez une URL directement :</label>
                        <input
                          type="text"
                          value={tutoVideoUrl}
                          onChange={(e) => setTutoVideoUrl(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="https://res.cloudinary.com/... ou ID Telegram"
                        />
                        <p className="text-gray-400 text-sm mt-2">
                          Formats supportés : MP4, MOV, AVI. Taille max : 50MB pour Telegram
                        </p>
                      </div>
                    </div>
                    
                    {/* Texte du tutoriel */}
                    <div>
                      <label className="block text-white mb-2">Texte du tutoriel</label>
                      <textarea
                        value={tutoText}
                        onChange={(e) => setTutoText(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                        rows={12}
                        placeholder="🤖 <b>TUTORIEL DU BOT</b>

Bienvenue dans notre bot de plugs certifiés!

Ce bot vous permet de:
• 🔌 Découvrir des plugs certifiés
• 🏅 Gagner des badges
• 🗳️ Voter pour vos plugs favoris
• 🏆 Participer aux classements
• 💎 Débloquer des récompenses

Utilisez les boutons du menu pour naviguer."
                      />
                      <div className="mt-3 space-y-2">
                        <p className="text-gray-400 text-sm">Formatage HTML supporté :</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <code className="bg-gray-800 px-2 py-1 rounded">&lt;b&gt;Gras&lt;/b&gt;</code>
                          <code className="bg-gray-800 px-2 py-1 rounded">&lt;i&gt;Italique&lt;/i&gt;</code>
                          <code className="bg-gray-800 px-2 py-1 rounded">&lt;u&gt;Souligné&lt;/u&gt;</code>
                          <code className="bg-gray-800 px-2 py-1 rounded">&lt;s&gt;Barré&lt;/s&gt;</code>
                          <code className="bg-gray-800 px-2 py-1 rounded">&lt;code&gt;Code&lt;/code&gt;</code>
                          <code className="bg-gray-800 px-2 py-1 rounded">&lt;pre&gt;Bloc code&lt;/pre&gt;</code>
                        </div>
                      </div>
                    </div>
                    
                    {/* Aperçu du texte */}
                    {tutoText && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Aperçu du texte</h3>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div 
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: tutoText
                                .replace(/\n/g, '<br>')
                                .replace(/•/g, '&bull;')
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={handleSaveSettings}
                      className="btn-primary mt-6 w-full sm:w-auto"
                    >
                      <CheckIcon className="w-5 h-5 mr-2" />
                      Sauvegarder le tutoriel
                    </button>
                  </div>
                  
                  {/* Instructions */}
                  <div className="glass-card p-6 bg-blue-900/20 border-blue-500/30">
                    <h3 className="text-lg font-bold text-blue-400 mb-3">💡 Comment utiliser le tutoriel</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">1.</span>
                        <span>Les utilisateurs peuvent accéder au tutoriel via le bouton "🤖 TUTO BOT" dans le menu du bot</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">2.</span>
                        <span>Si une vidéo est configurée, elle sera affichée en premier</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">3.</span>
                        <span>Le texte s'affiche ensuite pour compléter les explications</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-400 mr-2">4.</span>
                        <span>Utilisez des emojis et du formatage pour rendre le tutoriel plus attractif</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Maintenance */}
              {activeTab === 'maintenance' && (
                <div className="space-y-6 max-w-4xl">
                  <h1 className="text-3xl font-bold text-white">Mode Maintenance</h1>
                  
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Contrôle de la maintenance</h2>
                    <p className="text-gray-400 mb-6">
                      Activez le mode maintenance pour afficher un message aux utilisateurs du bot et du site web.
                    </p>
                    
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white text-white">État actuel</h3>
                          <p className="text-gray-400">
                            Le système est actuellement {maintenanceMode ? 
                              <span className="text-red-500 font-bold">en maintenance</span> : 
                              <span className="text-green-500 font-bold">actif</span>
                            }
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold ${
                          maintenanceMode ? 'bg-red-600' : 'bg-green-600'
                        }`}>
                          {maintenanceMode ? 'MAINTENANCE' : 'ACTIF'}
                        </div>
                      </div>
                      
                      {/* Durée de maintenance */}
                      {!maintenanceMode && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-300 mb-3">Durée de la maintenance</h4>
                          <div className="flex gap-4 items-center">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Jours</label>
                              <input
                                type="number"
                                min="0"
                                max="999"
                                value={maintenanceDuration.days}
                                onChange={(e) => setMaintenanceDuration({
                                  ...maintenanceDuration,
                                  days: Math.max(0, parseInt(e.target.value) || 0)
                                })}
                                className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center"
                              />
                            </div>
                            <div className="pt-5">j</div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Heures</label>
                              <input
                                type="number"
                                min="0"
                                max="999"
                                value={maintenanceDuration.hours}
                                onChange={(e) => setMaintenanceDuration({
                                  ...maintenanceDuration,
                                  hours: Math.max(0, parseInt(e.target.value) || 0)
                                })}
                                className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center"
                              />
                            </div>
                            <div className="pt-5">h</div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Minutes</label>
                              <input
                                type="number"
                                min="0"
                                max="59"
                                value={maintenanceDuration.minutes}
                                onChange={(e) => setMaintenanceDuration({
                                  ...maintenanceDuration,
                                  minutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                                })}
                                className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center"
                              />
                            </div>
                            <div className="pt-5">min</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Temps restant */}
                      {maintenanceMode && maintenanceEndTime && (
                        <MaintenanceCountdown endTime={maintenanceEndTime} />
                      )}
                      
                      <button
                        onClick={async () => {
                          try {
                            const endTime = !maintenanceMode 
                              ? new Date(Date.now() + (maintenanceDuration.days * 24 * 60 + maintenanceDuration.hours * 60 + maintenanceDuration.minutes) * 60 * 1000)
                              : null;
                            
                            const res = await fetch('/api/settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                maintenanceMode: !maintenanceMode,
                                maintenanceEndTime: endTime
                              })
                            })
                            
                            if (res.ok) {
                              setMaintenanceMode(!maintenanceMode)
                              if (!maintenanceMode) {
                                setMaintenanceEndTime(endTime)
                              } else {
                                setMaintenanceEndTime(null)
                              }
                              
                              // Mettre à jour le cookie
                              document.cookie = `maintenanceMode=${!maintenanceMode}; path=/; max-age=3600; samesite=lax`
                              
                              toast.success(maintenanceMode ? 'Mode maintenance désactivé' : 'Mode maintenance activé')
                              mutate('/api/settings')
                            }
                          } catch (error) {
                            toast.error('Erreur lors de la mise à jour')
                          }
                        }}
                        className={`w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          maintenanceMode 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {maintenanceMode ? (
                          <>
                            <CheckIcon className="w-5 h-5" />
                            Désactiver la maintenance
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Activer la maintenance
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Configuration des images de maintenance */}
                    <div className="space-y-6 mt-6">
                      <h3 className="text-lg font-semibold text-white text-white mb-4">🖼️ Personnalisation de la page de maintenance</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo de maintenance */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Logo de maintenance
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={maintenanceLogo}
                              onChange={(e) => setMaintenanceLogo(e.target.value)}
                              placeholder="URL du logo (ex: https://...)"
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            />
                            {maintenanceLogo && (
                              <div className="mt-2 p-4 bg-gray-800 rounded-lg">
                                <img 
                                  src={maintenanceLogo} 
                                  alt="Logo de maintenance" 
                                  className="max-h-32 mx-auto rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Logo'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Image de fond */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Image de fond
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={maintenanceBackgroundImage}
                              onChange={(e) => setMaintenanceBackgroundImage(e.target.value)}
                              placeholder="URL de l'image de fond (ex: https://...)"
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            />
                            {maintenanceBackgroundImage && (
                              <div className="mt-2 p-4 bg-gray-800 rounded-lg">
                                <img 
                                  src={maintenanceBackgroundImage} 
                                  alt="Image de fond" 
                                  className="w-full h-32 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Background'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                maintenanceBackgroundImage,
                                maintenanceLogo
                              })
                            })
                            
                            if (res.ok) {
                              toast.success('Images de maintenance mises à jour')
                              mutate('/api/settings')
                            }
                          } catch (error) {
                            toast.error('Erreur lors de la mise à jour')
                          }
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                      >
                        Sauvegarder les images
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Message Bot Telegram
                        </h4>
                        <p className="text-gray-300 text-sm">
                          🔧 <strong>Maintenance en cours</strong><br/>
                          <br/>
                          Nous sommes bientôt de retour !<br/>
                          <br/>
                          Cordialement,<br/>
                          NOS PLUGS DU MOMENT
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Affiché avec l'image d'accueil configurée
                        </p>
                      </div>
                      
                      <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          Page Site Web
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Une page de maintenance sera affichée sur tout le site avec un design moderne et professionnel.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Les administrateurs peuvent toujours accéder au panel
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Important</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Le mode maintenance affecte le bot Telegram ET le site web</li>
                        <li>• Les administrateurs peuvent toujours accéder au panel admin</li>
                        <li>• Les utilisateurs verront un message de maintenance</li>
                        <li>• N'oubliez pas de désactiver la maintenance une fois terminée</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Settings */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-4xl">
                  <h1 className="text-3xl font-bold text-white">Paramètres</h1>
                  
                  {/* Mini App Button Text */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">🔌 Texte du bouton Mini App</h2>
                    <p className="text-gray-400 mb-4">
                      Personnalisez le texte affiché sur le bouton Mini App en haut du bot Telegram.
                    </p>
                    <input
                      type="text"
                      value={miniAppButtonText}
                      onChange={(e) => setMiniAppButtonText(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ex: PLUGS DU MOMENT 🔌"
                    />
                    <button
                      onClick={handleSaveSettings}
                      className="btn-primary mt-4"
                    >
                      Enregistrer
                    </button>
                  </div>
                  
                  {/* Welcome Message */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Message d'accueil du bot</h2>
                    <textarea
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      rows={4}
                      placeholder="Message d'accueil..."
                    />
                    <button
                      onClick={handleSaveSettings}
                      className="btn-primary mt-4"
                    >
                      Enregistrer
                    </button>
                  </div>
                  
                  {/* Info Text */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">ℹ️ Texte d'informations</h2>
                    <p className="text-gray-400 mb-4">
                      Ce texte s'affiche quand les utilisateurs cliquent sur "ℹ️ Informations" dans le menu du bot.
                    </p>
                    <textarea
                      value={infoText}
                      onChange={(e) => setInfoText(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      rows={6}
                      placeholder="Entrez le texte d'informations..."
                    />
                    <button
                      onClick={handleSaveSettings}
                      className="btn-primary mt-4"
                    >
                      Enregistrer
                    </button>
                  </div>
                  
                  {/* Tutoriel Bot */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">🤖 Tutoriel du Bot</h2>
                    <p className="text-gray-400 mb-4">
                      Configurez le tutoriel qui s'affiche quand les utilisateurs cliquent sur "🤖 TUTO BOT" dans le menu.
                    </p>
                    
                    {/* Upload ou URL de la vidéo */}
                    <div className="mb-6">
                      <label className="block text-white mb-2">Vidéo du tutoriel (optionnel)</label>
                      
                      {/* Upload de vidéo */}
                      <MediaUpload
                        onUpload={(url, type) => setTutoVideoUrl(url)}
                        currentMedia={tutoVideoUrl}
                        currentType={tutoVideoUrl?.includes('.mp4') || tutoVideoUrl?.includes('.mov') ? 'video' : 'image'}
                        label="Uploader une image ou vidéo depuis votre appareil"
                        acceptVideo={true}
                      />
                      
                      {/* OU URL directe */}
                      <div className="mt-4">
                        <label className="block text-gray-400 text-sm mb-2">Ou entrez une URL directement :</label>
                        <input
                          type="text"
                          value={tutoVideoUrl}
                          onChange={(e) => setTutoVideoUrl(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                          placeholder="https://exemple.com/video.mp4 ou ID Telegram"
                        />
                      </div>
                    </div>
                    
                    {/* Texte du tutoriel */}
                    <div className="mb-4">
                      <label className="block text-white mb-2">Texte du tutoriel</label>
                      <textarea
                        value={tutoText}
                        onChange={(e) => setTutoText(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                        rows={8}
                        placeholder="Entrez le texte du tutoriel..."
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Vous pouvez utiliser le formatage HTML Telegram (gras: &lt;b&gt;, italique: &lt;i&gt;, etc.)
                      </p>
                    </div>
                    
                    <button
                      onClick={handleSaveSettings}
                      className="btn-primary"
                    >
                      Enregistrer
                    </button>
                  </div>
                  
                  {/* Global Message - Désactivé, utiliser /broadcast dans le bot 
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Envoyer un message global</h2>
                    <textarea
                      value={globalMessage}
                      onChange={(e) => setGlobalMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      rows={4}
                      placeholder="Message à envoyer à tous les utilisateurs..."
                    />
                    <button
                      onClick={handleSendGlobalMessage}
                      className="btn-primary mt-4 flex items-center gap-2"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                      Envoyer à tous
                    </button>
                  </div>
                  */}
                  
                  {/* Image Management */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Personnalisation visuelle</h2>
                    
                    <div className="space-y-6">


                      {/* Fond de la boutique */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-2xl">🎨</span> Fond de la boutique
                        </h3>
                        <div className="bg-gray-800 border-2 border-gray-600 rounded-xl p-4">
                          <ImageUpload
                            currentImage={settings?.backgroundImage}
                            onUpload={async (url) => {
                              try {
                                const res = await fetch('/api/settings/background', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ backgroundImage: url })
                                })
                                if (res.ok) {
                                  toast.success('Fond mis à jour !')
                                  // Forcer le rechargement des settings
                                  mutate('/api/settings')
                                  // Recharger la page après 1 seconde pour appliquer le fond
                                  setTimeout(() => {
                                    window.location.reload()
                                  }, 1000)
                                }
                              } catch (error) {
                                toast.error('Erreur lors de la mise à jour')
                              }
                            }}
                          />
                          <p className="text-xs text-gray-400 mt-2">
                            Recommandé : Image haute résolution, 1920x1080px minimum
                          </p>
                          {settings?.backgroundImage && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-400 mb-1">Image actuelle :</p>
                              <img 
                                src={settings.backgroundImage} 
                                alt="Fond actuel" 
                                className="w-32 h-20 object-cover rounded border border-gray-700"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image d'accueil du bot */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-2xl">🤖</span> Image d'accueil du bot
                        </h3>
                        <div className="bg-gray-800 border-2 border-gray-600 rounded-xl p-4">
                          <ImageUpload
                            onUpload={async (url) => {
                              try {
                                const res = await fetch('/api/settings', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ welcomeImage: url })
                                })
                                if (res.ok) {
                                  toast.success('Image d\'accueil mise à jour !')
                                }
                              } catch (error) {
                                toast.error('Erreur lors de la mise à jour')
                              }
                            }}
                          />
                          <p className="text-xs text-gray-400 mt-2">
                            Cette image sera affichée dans le message d'accueil du bot Telegram
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bot Social Networks */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Réseaux sociaux du bot</h2>
                    <p className="text-gray-400 mb-4">Ces liens apparaîtront en bas du menu principal du bot Telegram</p>
                    
                    <div className="space-y-4">
                      {botSocialNetworks?.map((network: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <input
                            type="text"
                            value={network.emoji || ''}
                            onChange={(e) => {
                              const newNetworks = [...botSocialNetworks]
                              newNetworks[index].emoji = e.target.value
                              setBotSocialNetworks(newNetworks)
                            }}
                            placeholder="🔗"
                            className="w-16 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-center"
                          />
                          <input
                            type="text"
                            value={network.name || ''}
                            onChange={(e) => {
                              const newNetworks = [...botSocialNetworks]
                              newNetworks[index].name = e.target.value
                              setBotSocialNetworks(newNetworks)
                            }}
                            placeholder="Nom du réseau"
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg"
                          />
                          <input
                            type="text"
                            value={network.url || ''}
                            onChange={(e) => {
                              const newNetworks = [...botSocialNetworks]
                              newNetworks[index].url = e.target.value
                              setBotSocialNetworks(newNetworks)
                            }}
                            placeholder="https://..."
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg"
                          />
                          <input
                            type="number"
                            value={network.order || 0}
                            onChange={(e) => {
                              const newNetworks = [...botSocialNetworks]
                              newNetworks[index].order = parseInt(e.target.value) || 0
                              setBotSocialNetworks(newNetworks)
                            }}
                            placeholder="0"
                            className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-center"
                          />
                          <button
                            onClick={() => {
                              const newNetworks = botSocialNetworks.filter((_: any, i: number) => i !== index)
                              setBotSocialNetworks(newNetworks)
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => {
                          const newNetworks = [...botSocialNetworks, {
                            name: '',
                            url: '',
                            emoji: '🔗',
                            order: botSocialNetworks.length
                          }]
                          setBotSocialNetworks(newNetworks)
                        }}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Ajouter un réseau social
                      </button>
                      
                      <button
                        onClick={handleSaveBotSocialNetworks}
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                      >
                        <CheckIcon className="w-5 h-5" />
                        Sauvegarder les réseaux sociaux du bot
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </main>
      </div>
      
      {/* Add/Edit Plug Modal */}
      <AnimatePresence>
        {(showAddPlug || editingPlug) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 rounded-3xl w-full max-w-4xl my-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">
                    {editingPlug ? '✏️ Modifier le plug' : '➕ Ajouter un nouveau plug'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddPlug(false)
                      setEditingPlug(null)
                      setAdditionalLikes(0)
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-8">
                  {/* Section 1: Informations de base */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">📝</span> Informations de base
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Nom du plug *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: PlugsParis"
                          value={editingPlug ? editingPlug.name : newPlug.name}
                          onChange={(e) => editingPlug 
                            ? setEditingPlug({...editingPlug, name: e.target.value})
                            : setNewPlug({...newPlug, name: e.target.value})
                          }
                          className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Photo du plug
                        </label>
                        <div className="bg-gray-800 border-2 border-gray-600 rounded-xl p-4">
                          <ImageUpload
                            onUpload={(url) => editingPlug
                              ? setEditingPlug({...editingPlug, photo: url})
                              : setNewPlug({...newPlug, photo: url})
                            }
                          />
                          {(editingPlug?.photo || newPlug.photo) && (
                            <div className="mt-4">
                              <img 
                                src={editingPlug?.photo || newPlug.photo} 
                                alt="Preview" 
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          placeholder="Décrivez votre service..."
                          value={editingPlug ? editingPlug.description : newPlug.description}
                          onChange={(e) => editingPlug
                            ? setEditingPlug({...editingPlug, description: e.target.value})
                            : setNewPlug({...newPlug, description: e.target.value})
                          }
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Localisation et Pays */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">🌍</span> Pays et localisation
                    </h3>
                    
                    <CountryDepartmentSelector
                      selectedCountries={editingPlug?.countries || newPlug.countries}
                      selectedDepartments={[]}
                      onCountriesChange={(countries) => {
                        if (editingPlug) {
                          setEditingPlug({...editingPlug, countries})
                        } else {
                          setNewPlug({...newPlug, countries})
                        }
                      }}
                      onDepartmentsChange={() => {}}
                      showDepartments={false}
                    />
                    
                    {/* Coordonnées GPS */}
                    <div className="mt-6 space-y-4">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-blue-400" />
                        Coordonnées GPS (pour la carte)
                      </h4>
                      <p className="text-sm text-gray-400">
                        Entrez les coordonnées GPS pour afficher ce plug sur la carte. Vous pouvez les obtenir depuis Google Maps en cliquant droit sur un emplacement.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Latitude
                          </label>
                          <input
                            type="number"
                            step="any"
                            placeholder="Ex: 48.8566"
                            value={editingPlug?.location?.latitude ?? newPlug.location?.latitude ?? ''}
                            onChange={(e) => {
                              const value = e.target.value ? parseFloat(e.target.value) : undefined
                              if (editingPlug) {
                                setEditingPlug({
                                  ...editingPlug,
                                  location: {
                                    ...(editingPlug.location || { country: 'FR', department: '', postalCode: '' }),
                                    latitude: value
                                  }
                                })
                              } else {
                                setNewPlug({
                                  ...newPlug,
                                  location: {
                                    ...newPlug.location,
                                    latitude: value
                                  }
                                })
                              }
                            }}
                            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Longitude
                          </label>
                          <input
                            type="number"
                            step="any"
                            placeholder="Ex: 2.3522"
                            value={editingPlug?.location?.longitude ?? newPlug.location?.longitude ?? ''}
                            onChange={(e) => {
                              const value = e.target.value ? parseFloat(e.target.value) : undefined
                              if (editingPlug) {
                                setEditingPlug({
                                  ...editingPlug,
                                  location: {
                                    ...(editingPlug.location || { country: 'FR', department: '', postalCode: '' }),
                                    longitude: value
                                  }
                                })
                              } else {
                                setNewPlug({
                                  ...newPlug,
                                  location: {
                                    ...newPlug.location,
                                    longitude: value
                                  }
                                })
                              }
                            }}
                            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const { latitude, longitude } = position.coords
                                if (editingPlug) {
                                  setEditingPlug({
                                    ...editingPlug,
                                    location: {
                                      ...(editingPlug.location || { country: 'FR', department: '', postalCode: '' }),
                                      latitude,
                                      longitude
                                    }
                                  })
                                } else {
                                  setNewPlug({
                                    ...newPlug,
                                    location: {
                                      ...newPlug.location,
                                      latitude,
                                      longitude
                                    }
                                  })
                                }
                                toast.success('Coordonnées GPS récupérées !')
                              },
                              (error) => {
                                toast.error('Impossible de récupérer votre position')
                                console.error('Geolocation error:', error)
                              }
                            )
                          } else {
                            toast.error('La géolocalisation n\'est pas supportée par votre navigateur')
                          }
                        }}
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <MapPinIcon className="w-5 h-5" />
                        Utiliser ma position actuelle
                      </button>
                    </div>

                  </div>

                  {/* Section 3: Méthodes de livraison */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="text-2xl">🚚</span> Méthodes disponibles
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center gap-3 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 transition-all">
                          <input
                            type="checkbox"
                            checked={editingPlug?.methods?.delivery || newPlug.methods.delivery}
                            onChange={(e) => editingPlug
                              ? setEditingPlug({...editingPlug, methods: {...(editingPlug.methods || {}), delivery: e.target.checked}})
                              : setNewPlug({...newPlug, methods: {...newPlug.methods, delivery: e.target.checked}})
                            }
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-lg text-white">🚚 Livraison</span>
                        </label>
                        
                        <label className="flex items-center gap-3 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl cursor-pointer hover:border-green-500 transition-all">
                          <input
                            type="checkbox"
                            checked={editingPlug?.methods?.shipping || newPlug.methods.shipping}
                            onChange={(e) => editingPlug
                              ? setEditingPlug({...editingPlug, methods: {...(editingPlug.methods || {}), shipping: e.target.checked}})
                              : setNewPlug({...newPlug, methods: {...newPlug.methods, shipping: e.target.checked}})
                            }
                            className="w-5 h-5 text-green-600"
                          />
                          <span className="text-lg text-white">📦 Envoi postal</span>
                        </label>
                        
                        <label className="flex items-center gap-3 p-4 bg-gray-800 border-2 border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition-all">
                          <input
                            type="checkbox"
                            checked={editingPlug?.methods?.meetup || newPlug.methods.meetup}
                            onChange={(e) => editingPlug
                              ? setEditingPlug({...editingPlug, methods: {...(editingPlug.methods || {}), meetup: e.target.checked}})
                              : setNewPlug({...newPlug, methods: {...newPlug.methods, meetup: e.target.checked}})
                            }
                            className="w-5 h-5 text-purple-600"
                          />
                          <span className="text-lg text-white">🤝 Meetup</span>
                        </label>
                      </div>

                      {/* Départements de livraison */}
                      {(editingPlug?.methods?.delivery || newPlug.methods.delivery) && (
                        <div className="mt-6 p-4 bg-gray-800 rounded-xl border-2 border-blue-600/30">
                          <h4 className="text-sm font-semibold text-gray-300 mb-4">
                            🚚 Sélectionnez les départements où vous livrez
                          </h4>
                          <CountryDepartmentSelector
                            selectedCountries={editingPlug?.countries || newPlug.countries}
                            selectedDepartments={editingPlug?.deliveryDepartments || newPlug.deliveryDepartments}
                            onCountriesChange={() => {}} // Pas de changement ici, juste affichage
                            onDepartmentsChange={(departments) => {
                              if (editingPlug) {
                                setEditingPlug({...editingPlug, deliveryDepartments: departments})
                              } else {
                                setNewPlug({...newPlug, deliveryDepartments: departments})
                              }
                            }}
                            showDepartments={true}
                          />
                          
                          {/* Codes postaux de livraison */}
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-300 mb-2">
                              Codes postaux de livraison (optionnel)
                            </h5>
                            <PostalCodeManager
                              postalCodes={editingPlug?.deliveryPostalCodes || newPlug.deliveryPostalCodes || []}
                              onChange={(codes) => {
                                if (editingPlug) {
                                  setEditingPlug({...editingPlug, deliveryPostalCodes: codes})
                                } else {
                                  setNewPlug({...newPlug, deliveryPostalCodes: codes})
                                }
                              }}
                              placeholder="Ex: 75001, 69002..."
                            />
                          </div>
                        </div>
                      )}

                      {/* Pays d'envoi postal */}
                      {(editingPlug?.methods?.shipping || newPlug.methods.shipping) && (
                        <div className="mt-6 p-4 bg-gray-800 rounded-xl border-2 border-green-600/30">
                          <h4 className="text-sm font-semibold text-gray-300 mb-4">
                            📦 Sélectionnez les pays où vous envoyez
                          </h4>
                          <CountryDepartmentSelector
                            selectedCountries={editingPlug?.shippingCountries || editingPlug?.countries || newPlug.countries}
                            selectedDepartments={[]}
                            onCountriesChange={(countries) => {
                              if (editingPlug) {
                                setEditingPlug({...editingPlug, shippingCountries: countries})
                              } else {
                                setNewPlug({...newPlug, shippingCountries: countries})
                              }
                            }}
                            onDepartmentsChange={() => {}}
                            showDepartments={false}
                          />
                        </div>
                      )}

                      {/* Zones de meetup */}
                      {(editingPlug?.methods?.meetup || newPlug.methods.meetup) && (
                        <div className="mt-6 p-4 bg-gray-800 rounded-xl border-2 border-purple-600/30">
                          <h4 className="text-sm font-semibold text-gray-300 mb-4">
                            🤝 Sélectionnez les zones où vous proposez des meetups
                          </h4>
                          <CountryDepartmentSelector
                            selectedCountries={editingPlug?.countries || newPlug.countries}
                            selectedDepartments={editingPlug?.meetupDepartments || newPlug.meetupDepartments || []}
                            onCountriesChange={() => {}} // Pas de changement ici, juste affichage
                            onDepartmentsChange={(departments) => {
                              if (editingPlug) {
                                setEditingPlug({...editingPlug, meetupDepartments: departments})
                              } else {
                                setNewPlug({...newPlug, meetupDepartments: departments})
                              }
                            }}
                            showDepartments={true}
                          />
                          
                          {/* Codes postaux de meetup */}
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-300 mb-2">
                              Codes postaux de meetup (optionnel)
                            </h5>
                            <PostalCodeManager
                              postalCodes={editingPlug?.meetupPostalCodes || newPlug.meetupPostalCodes || []}
                              onChange={(codes) => {
                                if (editingPlug) {
                                  setEditingPlug({...editingPlug, meetupPostalCodes: codes})
                                } else {
                                  setNewPlug({...newPlug, meetupPostalCodes: codes})
                                }
                              }}
                              placeholder="Ex: 75001, 69002..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 4: Réseaux sociaux */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <SocialNetworkManager
                      networks={editingPlug ? (editingPlug.customNetworks || []) : (newPlug.customNetworks || [])}
                      onChange={(networks) => {
                        if (editingPlug) {
                          setEditingPlug({...editingPlug, customNetworks: networks})
                        } else {
                          setNewPlug({...newPlug, customNetworks: networks})
                        }
                      }}
                    />
                  </div>

                  {/* Section 5: Lien de parrainage */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">🔗</span> Lien de parrainage
                    </h3>
                    <div className="space-y-4">
                      {/* Lien généré automatiquement */}
                      {editingPlug?._id && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Lien de parrainage généré
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME || 'PLGSCRTF_BOT'}?start=plug_${editingPlug._id}_${settings?.adminChatIds?.[0] || 'admin'}`}
                              className="flex-1 px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-xl text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME || 'PLGSCRTF_BOT'}?start=plug_${editingPlug._id}_${settings?.adminChatIds?.[0] || 'admin'}`)
                                toast.success('Lien copié !')
                              }}
                              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-all"
                            >
                              📋 Copier
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Nombre de J'aime */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          ❤️ J'aime supplémentaires
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            min="0"
                            max="9999"
                            placeholder="0"
                            value={additionalLikes}
                            onChange={(e) => setAdditionalLikes(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-32 px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-all text-center"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-300">
                              {editingPlug && (
                                <span>
                                  J'aime actuels : <span className="font-bold text-red-400">{editingPlug.likes || 0}</span> • 
                                  Total après ajout : <span className="font-bold text-green-400">{(editingPlug.likes || 0) + additionalLikes}</span>
                                </span>
                              )}
                              {!editingPlug && (
                                <span>Le plug aura <span className="font-bold text-green-400">{additionalLikes}</span> j'aime au départ</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Utilisez cette fonction pour booster artificiellement la popularité
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lien personnalisé */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Lien personnalisé (optionnel)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://t.me/votrebot?start=custom..."
                            value={editingPlug ? (editingPlug.referralLink || '') : (newPlug.referralLink || '')}
                            onChange={(e) => editingPlug
                              ? setEditingPlug({...editingPlug, referralLink: e.target.value})
                              : setNewPlug({...newPlug, referralLink: e.target.value})
                            }
                            className="flex-1 px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                          />
                          {(editingPlug?.referralLink || newPlug.referralLink) && (
                            <button
                              type="button"
                              onClick={() => {
                                const link = editingPlug ? editingPlug.referralLink : newPlug.referralLink
                                if (link) {
                                  navigator.clipboard.writeText(link)
                                  toast.success('Lien personnalisé copié !')
                                }
                              }}
                              className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white transition-all"
                            >
                              📋 Copier
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Si défini, ce lien sera utilisé à la place du lien généré
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setShowAddPlug(false)
                        setEditingPlug(null)
                        setAdditionalLikes(0)
                      }}
                      className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={editingPlug ? handleUpdatePlug : handleAddPlug}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="w-5 h-5" />
                      {editingPlug ? 'Mettre à jour' : 'Ajouter le plug'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Application Modal */}
      <AnimatePresence>
        {showEditApplication && editingApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditApplication(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6">Modifier la candidature de @{editingApplication.username}</h3>
              
              <div className="space-y-6">
                {/* Photo de la boutique */}
                {(editingApplication.photo || editingApplication.shopPhoto) && (
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      📸 Photo de la boutique
                    </label>
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <img 
                        src={`/api/telegram-photo/${editingApplication.photo || editingApplication.shopPhoto}`}
                        alt="Photo de la boutique"
                        className="w-full max-w-md h-64 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden bg-gray-800 p-3 rounded text-sm text-gray-400">
                        ⚠️ Impossible de charger la photo. ID: {editingApplication.photo || editingApplication.shopPhoto}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={`/api/telegram-photo/${editingApplication.photo || editingApplication.shopPhoto}`}
                          download={`boutique_${editingApplication.username}.jpg`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                        >
                          📥 Télécharger la photo
                        </a>
                        <button
                          onClick={() => window.open(`/api/telegram-photo/${editingApplication.photo || editingApplication.shopPhoto}`, '_blank')}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                        >
                          🔗 Ouvrir dans un nouvel onglet
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Réseaux sociaux avec liens */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📱 Réseaux sociaux et liens
                  </label>
                  <div className="space-y-2">
                    {editingApplication.socialNetworks?.primary?.map((network: string, idx: number) => {
                      const networkNames: any = {
                        snap: '👻 Snapchat',
                        instagram: '📸 Instagram',
                        whatsapp: '💬 WhatsApp',
                        signal: '🔐 Signal',
                        threema: '🔒 Threema',
                        potato: '🥔 Potato',
                        telegram: '✈️ Telegram'
                      };
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-32">{networkNames[network] || network}:</span>
                          <input
                            type="text"
                            value={editingApplication.socialNetworks?.links?.[network] || ''}
                            onChange={(e) => {
                              const newApp = {...editingApplication};
                              if (!newApp.socialNetworks.links) newApp.socialNetworks.links = {};
                              newApp.socialNetworks.links[network] = e.target.value;
                              setEditingApplication(newApp);
                            }}
                            placeholder="Lien ou @username"
                            className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded"
                          />
                        </div>
                      );
                    })}
                    
                    {editingApplication.socialNetworks?.others && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <label className="block text-sm text-gray-400 mb-1">Autres réseaux:</label>
                        <textarea
                          value={editingApplication.socialNetworks.others}
                          onChange={(e) => setEditingApplication({
                            ...editingApplication,
                            socialNetworks: {...editingApplication.socialNetworks, others: e.target.value}
                          })}
                          rows={2}
                          className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Méthodes de vente et zones */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📦 Méthodes de vente et zones
                  </label>
                  <div className="space-y-3">
                    {editingApplication.methods?.delivery && (
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <input
                            type="checkbox"
                            checked={editingApplication.methods.delivery}
                            onChange={(e) => setEditingApplication({
                              ...editingApplication,
                              methods: {...editingApplication.methods, delivery: e.target.checked}
                            })}
                          />
                          🚚 Livraison
                        </label>
                        <textarea
                          value={editingApplication.deliveryZones || ''}
                          onChange={(e) => setEditingApplication({...editingApplication, deliveryZones: e.target.value})}
                          placeholder="Zones de livraison (départements, codes postaux...)"
                          rows={2}
                          className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                        />
                      </div>
                    )}
                    
                    {editingApplication.methods?.shipping && (
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <input
                            type="checkbox"
                            checked={editingApplication.methods.shipping}
                            onChange={(e) => setEditingApplication({
                              ...editingApplication,
                              methods: {...editingApplication.methods, shipping: e.target.checked}
                            })}
                          />
                          📮 Envoi
                        </label>
                        <textarea
                          value={editingApplication.shippingZones || ''}
                          onChange={(e) => setEditingApplication({...editingApplication, shippingZones: e.target.value})}
                          placeholder="Zones d'envoi (pays, régions...)"
                          rows={2}
                          className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                        />
                      </div>
                    )}
                    
                    {editingApplication.methods?.meetup && (
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <input
                            type="checkbox"
                            checked={editingApplication.methods.meetup}
                            onChange={(e) => setEditingApplication({
                              ...editingApplication,
                              methods: {...editingApplication.methods, meetup: e.target.checked}
                            })}
                          />
                          🤝 Meetup
                        </label>
                        <textarea
                          value={editingApplication.meetupZones || ''}
                          onChange={(e) => setEditingApplication({...editingApplication, meetupZones: e.target.value})}
                          placeholder="Zones de meetup (villes, quartiers...)"
                          rows={2}
                          className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Localisation principale */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📍 Localisation principale du vendeur
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Pays</label>
                      <input
                        type="text"
                        value={editingApplication.country || ''}
                        onChange={(e) => setEditingApplication({...editingApplication, country: e.target.value})}
                        placeholder="Ex: France"
                        className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Département</label>
                      <input
                        type="text"
                        value={editingApplication.department || ''}
                        onChange={(e) => setEditingApplication({...editingApplication, department: e.target.value})}
                        placeholder="Ex: 75"
                        className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Code postal</label>
                      <input
                        type="text"
                        value={editingApplication.postalCode || ''}
                        onChange={(e) => setEditingApplication({...editingApplication, postalCode: e.target.value})}
                        placeholder="Ex: 75001"
                        className="w-full px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    📝 Description
                  </label>
                  <textarea
                    value={editingApplication.description || ''}
                    onChange={(e) => setEditingApplication({...editingApplication, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>
                
                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={async () => {
                      // Sauvegarder les modifications
                      try {
                        const res = await fetch(`/api/applications/${editingApplication._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(editingApplication)
                        })
                        
                        if (res.ok) {
                          toast.success('Candidature modifiée')
                          mutate('/api/applications')
                          setShowEditApplication(false)
                          setEditingApplication(null)
                        }
                      } catch (error) {
                        toast.error('Erreur lors de la modification')
                      }
                    }}
                    className="flex-1 btn-primary"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setShowEditApplication(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <ProductModal
        isOpen={showAddProduct}
        onClose={() => {
          setShowAddProduct(false)
          setEditingProduct(null)
        }}
        product={editingProduct}
        onSuccess={() => {
          mutate('/api/products')
          setShowAddProduct(false)
          setEditingProduct(null)
        }}
      />
    </div>
  )
}