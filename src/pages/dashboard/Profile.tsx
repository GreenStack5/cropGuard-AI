import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Building2,
  Check,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Ruler,
  Sprout,
  Wheat,
} from 'lucide-react'
import { currentUser } from '../../data/mock'
import type { UserProfile } from '../../types'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Input } from '../../components/ui/Input'
import { readPreferences, savePreferences } from '../../lib/preferences'

type ProfileForm = Pick<
  UserProfile,
  'name' | 'email' | 'phone' | 'location'
> & { farmName: string; farmSize: string; primaryCrops: string }

const initialForm: ProfileForm = {
  name: readPreferences().name,
  email: currentUser.email,
  phone: currentUser.phone,
  location: currentUser.location,
  farmName: currentUser.farmName,
  farmSize: currentUser.farmSize,
  primaryCrops: currentUser.primaryCrops,
}

export function Profile() {
  const [form, setForm] = useState<ProfileForm>(initialForm)
  const [editMode, setEditMode] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const save = () => {
    setEditMode(false)
    setSaved(true)
    savePreferences({ ...readPreferences(), name: form.name })
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="View and manage your personal and farm information."
      />

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white shadow-sm sm:p-8"
      >
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-center gap-5">
          <Avatar name={form.name} size="lg" editable />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                {form.name}
              </h2>
              <Badge tone="neutral" className="bg-white/10 text-green-100">
                Farmer
              </Badge>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-100">
              <Mail className="size-3.5" />
              {form.email}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-brand-100">
              <MapPin className="size-3.5" />
              {form.location}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Wheat, label: 'Crops', value: form.primaryCrops.split(',').length },
              { icon: Ruler, label: 'Farm', value: form.farmSize.replace(/[^0-9]/g, '') + ' ha' },
              { icon: Sprout, label: 'Member since', value: '2024' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm"
              >
                <item.icon className="mx-auto size-5 text-green-200" />
                <p className="mt-2 text-lg font-extrabold">{item.value}</p>
                <p className="text-[11px] font-medium text-brand-100">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Personal information"
            subtitle="How we contact you and display your name"
            action={
              <Button
                variant={editMode ? 'primary' : 'outline'}
                size="sm"
                onClick={editMode ? save : () => setEditMode(true)}
                leadingIcon={editMode ? <Check className="size-4" /> : <Pencil className="size-4" />}
              >
                {editMode ? 'Save changes' : 'Edit'}
              </Button>
            }
          />
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <Input
              label="Full name"
              value={form.name}
              disabled={!editMode}
              readOnly={!editMode}
              onChange={(event) => set('name', event.target.value)}
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              disabled={!editMode}
              readOnly={!editMode}
              onChange={(event) => set('email', event.target.value)}
              leadingIcon={<Mail className="size-4" />}
            />
            <Input
              label="Phone number"
              value={form.phone}
              disabled={!editMode}
              readOnly={!editMode}
              onChange={(event) => set('phone', event.target.value)}
              leadingIcon={<Phone className="size-4" />}
            />
            <Input
              label="Location"
              value={form.location}
              disabled={!editMode}
              readOnly={!editMode}
              onChange={(event) => set('location', event.target.value)}
              leadingIcon={<MapPin className="size-4" />}
            />
            {saved ? (
              <p className="flex items-center gap-2 rounded-xl bg-green-50 px-3.5 py-2.5 text-sm font-semibold text-green-700 sm:col-span-2">
                <Check className="size-4" />
                Profile changes saved.
              </p>
            ) : null}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Farm information"
            subtitle="Details about your farm used for tailored advice"
          />
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <Input
              label="Farm name"
              value={form.farmName}
              onChange={(event) => set('farmName', event.target.value)}
              leadingIcon={<Building2 className="size-4" />}
            />
            <Input
              label="Farm size"
              value={form.farmSize}
              onChange={(event) => set('farmSize', event.target.value)}
              leadingIcon={<Ruler className="size-4" />}
            />
            <Input
              label="Primary crops"
              value={form.primaryCrops}
              onChange={(event) => set('primaryCrops', event.target.value)}
              hint="Comma-separated, e.g. Maize, Cassava, Tomato"
              className="sm:col-span-2"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}