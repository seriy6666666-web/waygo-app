import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeArea } from '../src/components/layout/SafeArea';
import { MoodChips } from '../src/components/mood/MoodChips';
import { NoteInput } from '../src/components/mood/NoteInput';
import { Button } from '../src/components/ui/Button';
import { GlassCard } from '../src/components/ui/GlassCard';
import { insertMood } from '../src/services/database';
import { useAchievementStore } from '../src/stores/useAchievementStore';
import { useMoodStore } from '../src/stores/useMoodStore';
import { useThemeStore } from '../src/stores/useThemeStore';
import { spacing, typography } from '../src/theme/tokens';
import type { MoodKey } from '../src/types';
import { generateId } from '../src/utils/date';
import { hapticSelection, hapticSuccess } from '../src/utils/haptics';

export default function MoodScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const addMood = useMoodStore((s) => s.addMood);
  const colors = useThemeStore((s) => s.colors);
  const isNight = useThemeStore((s) => s.timeBucket) === 'night';

  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleSelectMood = (mood: MoodKey) => {
    hapticSelection();
    setSelectedMood(mood);
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    hapticSuccess();

    const entry = {
      id: generateId(),
      mood: selectedMood,
      note: note || null,
      photoUri,
      createdAt: new Date().toISOString(),
      synced: false,
    };

    await insertMood(entry);
    addMood(entry);
    useAchievementStore.getState().checkAndUnlock();
    router.back();
  };

  return (
    <SafeArea>
      <BlurView intensity={30} tint={isNight ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: typography.family.bold }]}>{t('mood.title')}</Text>

        <MoodChips selected={selectedMood} onSelect={handleSelectMood} />

        <NoteInput value={note} onChangeText={setNote} />

        <TouchableOpacity onPress={handlePickPhoto}>
          <GlassCard style={styles.photoBtn}>
            <Ionicons name={photoUri ? 'checkmark-circle' : 'camera-outline'} size={22} color={colors.accent} />
            <Text style={[styles.photoBtnText, { color: colors.textSecondary, fontFamily: typography.family.medium }]}>
              {photoUri
                ? (t('mood.photoAdded', 'Фото добавлено'))
                : t('mood.photo')}
            </Text>
          </GlassCard>
        </TouchableOpacity>

        {!photoUri && (
          <Text style={[styles.hint, { color: colors.textSecondary, fontFamily: typography.family.regular }]}>{t('mood.noPhoto')}</Text>
        )}

        <View style={styles.bottom}>
          <Button
            title={t('mood.save')}
            onPress={handleSave}
            disabled={!selectedMood}
          />
          <Button
            title={t('mood.skip')}
            onPress={() => router.back()}
            variant="ghost"
            style={styles.skipBtn}
          />
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.size.h1,
    marginTop: spacing.md,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  photoBtnText: {
    fontSize: typography.size.body,
  },
  hint: {
    fontSize: typography.size.caption,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottom: {
    marginTop: 'auto',
    gap: spacing.xs,
  },
  skipBtn: {
    marginTop: spacing.xs,
  },
});
