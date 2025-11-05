import React from 'react';
import { Modal, View, Pressable, Text } from 'react-native';

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  titleJP?: string;
};

export function CustomModal({ 
  visible, 
  onClose, 
  children, 
  title,
  titleJP 
}: CustomModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      className='w-full max-w-full '
    >
      {/* Backdrop com blur escuro */}
      <Pressable 
        className="flex-1 bg-black/80 justify-center items-center px-6"
        onPress={onClose}
      >
        {/* Container do Modal */}
        <Pressable
          className="w-full max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="bg-zinc-950 border border-neutral-800 rounded-2xl overflow-hidden">
            
            {/* Header com borda vermelha */}
            {(title || titleJP) && (
              <View className="bg-gradient-to-b from-red-950/50 to-transparent border-b border-neutral-800 px-6 pt-6 pb-4">
                {titleJP && (
                  <Text className="text-red-500 text-2xl font-black tracking-wider text-center mb-1">
                    {titleJP}
                  </Text>
                )}
                {title && (
                  <Text className="text-white text-lg font-semibold text-center">
                    {title}
                  </Text>
                )}
                
                {/* Decoração */}
                <View className="flex-row justify-center items-center gap-2 mt-3">
                  <View className="w-8 h-px bg-red-600" />
                  <Text className="text-neutral-700 text-xs">龍</Text>
                  <View className="w-8 h-px bg-red-600" />
                </View>
              </View>
            )}

            {/* Conteúdo do Modal */}
            <View className="px-6 py-6">
              {children}
            </View>

            {/* Footer com botão de fechar */}
            <View className="border-t border-neutral-800 px-6 py-4 bg-black/20">
              <Pressable 
                className="active:opacity-70"
                onPress={onClose}
              >
                <View className="bg-red-600 rounded-lg py-2 items-center">
                  <Text className="text-white font-bold text-sm tracking-wider">
                    FECHAR
                  </Text>
                </View>
              </Pressable>

              {/* Botão alternativo secundário */}
              <Pressable 
                className="active:opacity-70 mt-2"
                onPress={onClose}
              >
                <View className="bg-transparent border border-neutral-700 rounded-lg py-2.5 items-center">
                  <Text className="text-neutral-400 font-semibold text-xs tracking-wider">
                    CANCELAR
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Bordas decorativas laterais */}
            <View className="absolute left-0 top-20 w-1 h-16 bg-red-600/30" />
            <View className="absolute right-0 top-20 w-1 h-16 bg-red-600/30" />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Variante simplificada sem título
export function SimpleModal({ 
  visible, 
  onClose, 
  children 
}: Omit<CustomModalProps, 'title' | 'titleJP'>) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/80 justify-center items-center px-6"
        onPress={onClose}
      >
        <Pressable
          className="w-full max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="bg-zinc-950 border border-neutral-800 rounded-2xl p-6">
            {children}

            {/* Botão de fechar simples */}
            <Pressable 
              className="active:opacity-70 mt-4"
              onPress={onClose}
            >
              <View className="bg-red-600 rounded-lg py-3 items-center">
                <Text className="text-white font-bold text-sm">
                  FECHAR
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Variante de confirmação com dois botões
type ConfirmModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  titleJP?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

export function ConfirmModal({ 
  visible, 
  onClose, 
  onConfirm,
  title,
  titleJP,
  message,
  confirmText = "CONFIRMAR",
  cancelText = "CANCELAR",
  danger = false
}: ConfirmModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/80 justify-center items-center px-6"
        onPress={onClose}
      >
        <Pressable
          className="w-full max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="bg-zinc-950 border border-neutral-800 rounded-2xl overflow-hidden">
            
            {/* Header */}
            <View className={`${danger ? 'bg-red-950/50' : 'bg-gradient-to-b from-red-950/50 to-transparent'} border-b border-neutral-800 px-6 pt-6 pb-4`}>
              {titleJP && (
                <Text className={`${danger ? 'text-red-400' : 'text-red-500'} text-2xl font-black tracking-wider text-center mb-1`}>
                  {titleJP}
                </Text>
              )}
              {title && (
                <Text className="text-white text-lg font-semibold text-center">
                  {title}
                </Text>
              )}
              
              <View className="flex-row justify-center items-center gap-2 mt-3">
                <View className={`w-8 h-px ${danger ? 'bg-red-500' : 'bg-red-600'}`} />
                <Text className="text-neutral-700 text-xs">{danger ? '⚠️' : '龍'}</Text>
                <View className={`w-8 h-px ${danger ? 'bg-red-500' : 'bg-red-600'}`} />
              </View>
            </View>

            {/* Mensagem */}
            <View className="px-6 py-6">
              <Text className="text-neutral-300 text-sm leading-6 text-center">
                {message}
              </Text>
            </View>

            {/* Botões de ação */}
            <View className="border-t border-neutral-800 px-6 py-4 bg-black/20 gap-3">
              <Pressable 
                className="active:opacity-70"
                onPress={onConfirm}
              >
                <View className={`${danger ? 'bg-red-600' : 'bg-red-600'} rounded-lg py-3.5 items-center`}>
                  <Text className="text-white font-bold text-sm tracking-wider">
                    {confirmText}
                  </Text>
                </View>
              </Pressable>

              <Pressable 
                className="active:opacity-70"
                onPress={onClose}
              >
                <View className="bg-transparent border border-neutral-700 rounded-lg py-2.5 items-center">
                  <Text className="text-neutral-400 font-semibold text-xs tracking-wider">
                    {cancelText}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Bordas decorativas */}
            {danger && (
              <>
                <View className="absolute left-0 top-20 w-1 h-16 bg-red-500/50" />
                <View className="absolute right-0 top-20 w-1 h-16 bg-red-500/50" />
              </>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}