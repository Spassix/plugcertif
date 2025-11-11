import { redisHelpers } from '../redis'

const SETTINGS_KEY = 'settings:global'

export interface Settings {
  welcomeMessage?: string
  welcomeImage?: string
  infoText?: string
  miniAppButtonText?: string
  backgroundImage?: string
  logoImage?: string
  socialNetworks?: any
  botSocialNetworks?: any[]
  shopSocialNetworks?: any[]
  countries?: any[]
  departments?: any[]
  postalCodes?: any[]
  telegramChannelLink?: string
  telegramChannelId?: string
  maintenanceMode?: boolean
  maintenanceEndTime?: Date | null
  maintenanceBackgroundImage?: string
  maintenanceLogo?: string
  tutoVideoUrl?: string
  tutoText?: string
  adminChatIds?: string[]
  updatedAt?: Date
}

const defaultSettings: Settings = {
  welcomeMessage: '🔌 Bienvenue sur PLUGS CRTFS !\n\nLa marketplace exclusive des vendeurs certifiés.',
  welcomeImage: '',
  infoText: 'Informations sur notre service',
  miniAppButtonText: 'PLUGS DU MOMENT 🔌',
  backgroundImage: '',
  logoImage: '',
  telegramChannelLink: 'https://t.me/+RoI-Xzh-ma9iYmY0',
  telegramChannelId: '-1002736254394',
  maintenanceMode: false,
  maintenanceEndTime: null,
  maintenanceBackgroundImage: '',
  maintenanceLogo: '',
  tutoVideoUrl: '',
  tutoText: '🤖 <b>TUTORIEL DU BOT</b>\n\nBienvenue dans notre bot de plugs certifiés!\n\nCe bot vous permet de:\n• 🔌 Découvrir des plugs certifiés\n• 🏅 Gagner des badges\n• 🗳️ Voter pour vos plugs favoris\n• 🏆 Participer aux classements\n• 💎 Débloquer des récompenses\n\nUtilisez les boutons du menu pour naviguer.',
  updatedAt: new Date(),
}

export const SettingsModel = {
  // Obtenir les settings
  async findOne(): Promise<Settings> {
    const data = await redisHelpers.get<string>(SETTINGS_KEY)
    if (!data) {
      // Créer les settings par défaut
      await this.create(defaultSettings)
      return defaultSettings
    }
    const settings = JSON.parse(data)
    return { ...defaultSettings, ...settings }
  },

  // Créer ou mettre à jour les settings
  async create(data: Settings): Promise<Settings> {
    const settings: Settings = {
      ...defaultSettings,
      ...data,
      updatedAt: new Date(),
    }
    await redisHelpers.set(SETTINGS_KEY, JSON.stringify(settings))
    return settings
  },

  // Mettre à jour les settings
  async update(data: Partial<Settings>): Promise<Settings> {
    const existing = await this.findOne()
    const updated: Settings = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }
    await redisHelpers.set(SETTINGS_KEY, JSON.stringify(updated))
    return updated
  },
}

