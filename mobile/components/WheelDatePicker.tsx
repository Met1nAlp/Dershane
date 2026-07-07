import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius } from '../constants/theme';

const ITEM_H = 48;
const VISIBLE = 5;
const HALF = Math.floor(VISIBLE / 2);

const AYLAR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

function gunSayisi(ay: number, yil: number) {
  return new Date(yil, ay + 1, 0).getDate();
}

function gunler(ay: number, yil: number) {
  return Array.from({ length: gunSayisi(ay, yil) }, (_, i) => String(i + 1).padStart(2, '0'));
}

function yillar(min: Date, max: Date) {
  const result: string[] = [];
  for (let y = min.getFullYear(); y <= max.getFullYear(); y++) {
    result.push(String(y));
  }
  return result;
}

interface ColumnProps {
  data: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  flex?: number;
}

function Column({ data, selectedIndex, onSelect, flex = 1 }: ColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const lastIndexRef = useRef(selectedIndex);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
    }, 80);
    return () => clearTimeout(timeout);
  }, []);

  const handleScrollEnd = useCallback(
    (e: any) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.max(0, Math.min(data.length - 1, Math.round(y / ITEM_H)));
      if (idx !== lastIndexRef.current) {
        lastIndexRef.current = idx;
        onSelect(idx);
      }
    },
    [data.length, onSelect],
  );

  return (
    <View style={[col.wrapper, { flex }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: ITEM_H * HALF }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {data.map((item, i) => {
          const isSelected = i === selectedIndex;
          return (
            <View key={i} style={col.item}>
              <Text style={[col.text, isSelected && col.textSelected]}>{item}</Text>
            </View>
          );
        })}
      </ScrollView>
      {/* top fade */}
      <View style={[col.fade, col.fadeTop]} pointerEvents="none" />
      {/* bottom fade */}
      <View style={[col.fade, col.fadeBottom]} pointerEvents="none" />
    </View>
  );
}

export interface WheelDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function WheelDatePicker({
  value,
  onChange,
  minDate = new Date(2020, 0, 1),
  maxDate = new Date(2035, 11, 31),
}: WheelDatePickerProps) {
  const yilListesi = yillar(minDate, maxDate);
  const ayListesi = AYLAR;

  const yilIdx = Math.max(0, yilListesi.indexOf(String(value.getFullYear())));
  const ayIdx = value.getMonth();
  const gunListesi = gunler(ayIdx, value.getFullYear());
  const gunIdx = Math.min(value.getDate() - 1, gunListesi.length - 1);

  const setYil = (idx: number) => {
    const yeni = new Date(value);
    yeni.setFullYear(Number(yilListesi[idx]));
    const maxGun = gunSayisi(yeni.getMonth(), yeni.getFullYear());
    if (yeni.getDate() > maxGun) yeni.setDate(maxGun);
    onChange(clamp(yeni, minDate, maxDate));
  };

  const setAy = (idx: number) => {
    const yeni = new Date(value);
    yeni.setMonth(idx);
    const maxGun = gunSayisi(idx, yeni.getFullYear());
    if (yeni.getDate() > maxGun) yeni.setDate(maxGun);
    onChange(clamp(yeni, minDate, maxDate));
  };

  const setGun = (idx: number) => {
    const yeni = new Date(value);
    yeni.setDate(idx + 1);
    onChange(clamp(yeni, minDate, maxDate));
  };

  return (
    <View style={picker.container}>
      {/* Seçim çizgileri */}
      <View style={picker.selectionBox} pointerEvents="none" />

      <Column data={gunListesi} selectedIndex={gunIdx} onSelect={setGun} flex={1} />
      <Column data={ayListesi} selectedIndex={ayIdx} onSelect={setAy} flex={2} />
      <Column data={yilListesi} selectedIndex={yilIdx} onSelect={setYil} flex={1} />
    </View>
  );
}

function clamp(date: Date, min: Date, max: Date): Date {
  if (date < min) return new Date(min);
  if (date > max) return new Date(max);
  return date;
}

const col = StyleSheet.create({
  wrapper: { height: ITEM_H * VISIBLE, overflow: 'hidden' },
  item: { height: ITEM_H, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: FontSize.base, color: Colors.textMuted, fontWeight: '400' },
  textSelected: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '700' },
  fade: {
    position: 'absolute', left: 0, right: 0,
    height: ITEM_H * HALF,
  },
  fadeTop: {
    top: 0,
    background: undefined,
  } as any,
  fadeBottom: { bottom: 0 } as any,
});

const picker = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  selectionBox: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: ITEM_H,
    top: ITEM_H * HALF,
    backgroundColor: `${Colors.accent}18`,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: `${Colors.accent}40`,
    zIndex: 1,
  },
});
