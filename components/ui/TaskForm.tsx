import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (
    title: string,
    description?: string,
    dueDate?: Date
  ) => Promise<void>;
}

export default function TaskForm({
  visible,
  onClose,
  onAddTask,
}: TaskFormProps) {
  const { t, locale } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(null);
    setLoading(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", t("enterTaskTitle"));
      return;
    }

    try {
      setLoading(true);

      await onAddTask(
        title.trim(),
        description.trim() || undefined,
        dueDate || undefined
      );
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Error", t("failedAddTask"));
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const currentDate = dueDate || new Date();

      currentDate.setFullYear(selectedDate.getFullYear());
      currentDate.setMonth(selectedDate.getMonth());
      currentDate.setDate(selectedDate.getDate());

      setDueDate(currentDate);

      if (Platform.OS === "ios") {
        setTimeout(() => setShowTimePicker(true), 300);
      } else {
        setTimeout(() => setShowTimePicker(true), 300);
      }
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);

    if (selectedTime && dueDate) {
      const updatedDate = new Date(dueDate);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());

      setDueDate(updatedDate);
    }
  };

  const getDateButtonText = () => {
    if (dueDate) {
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return dueDate.toLocaleString(
        locale === "fr" ? "fr-FR" : "en-US",
        options
      );
    }
    return t("today");
  };

  const renderIOSDatePicker = () => {
    if (!showDatePicker) return null;

    return (
      <View className="absolute bottom-0 left-0 right-0 bg-white z-50 border-t border-gray-200">
        <View className="flex-row justify-between p-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
            <Text className="text-blue-500 text-base">{t("cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowDatePicker(false);
              if (dueDate) {
                setTimeout(() => setShowTimePicker(true), 300);
              }
            }}
          >
            <Text className="text-blue-500 font-bold text-base">{t("ok")}</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          className="h-56"
          locale={locale === "fr" ? "fr-FR" : "en-US"}
        />
      </View>
    );
  };

  const renderIOSTimePicker = () => {
    if (!showTimePicker) return null;

    return (
      <View className="absolute bottom-0 left-0 right-0 bg-white z-50 border-t border-gray-200">
        <View className="flex-row justify-between p-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => setShowTimePicker(false)}>
            <Text className="text-blue-500 text-base">{t("cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(false)}>
            <Text className="text-blue-500 font-bold text-base">{t("ok")}</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          value={dueDate || new Date()}
          mode="time"
          display="spinner"
          onChange={handleTimeChange}
          className="h-56"
          locale={locale === "fr" ? "fr-FR" : "en-US"}
        />
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/30 justify-end">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={100}
            >
              <View className="bg-white rounded-t-3xl pb-6">
                <View className="items-center pt-2 pb-4">
                  <View className="w-12 h-1 bg-gray-300 rounded-full"></View>
                </View>

                <View className="px-6">
                  <TextInput
                    className="text-2xl font-normal text-black mb-4 pb-2 border-b border-gray-200"
                    placeholder={t("taskTitlePlaceholder")}
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                    autoFocus
                  />

                  <TextInput
                    className="text-lg text-gray-600 mb-6"
                    placeholder={t("descriptionPlaceholder")}
                    placeholderTextColor="#999"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                  />

                  <View className="flex-row mb-8 space-x-2 flex-wrap">
                    <TouchableOpacity
                      className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-2"
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={dueDate ? "green" : "gray"}
                      />
                      <Text className="ml-2 text-gray-800 font-medium">
                        {getDateButtonText()}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-2">
                      <Ionicons name="alarm-outline" size={20} color="gray" />
                      <Text className="ml-2 text-gray-800 font-medium">
                        {t("reminder")}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity className="flex-row items-center">
                      <Ionicons name="folder-outline" size={20} color="gray" />
                      <Text className="ml-2 text-gray-800">{t("inbox")}</Text>
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color="gray"
                        className="ml-1"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-red-500 px-6 py-2 rounded-lg"
                      style={{ backgroundColor: "#dc4d3d" }}
                      onPress={handleSubmit}
                      disabled={loading || !title.trim()}
                      activeOpacity={0.7}
                    >
                      <Text className="text-white font-semibold">
                        {loading ? t("addingTask") : t("add")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {Platform.OS === "ios" ? (
        <>
          {renderIOSDatePicker()}
          {renderIOSTimePicker()}
        </>
      ) : (
        <>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              locale={locale === "fr" ? "fr-FR" : "en-US"}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
              locale={locale === "fr" ? "fr-FR" : "en-US"}
            />
          )}
        </>
      )}
    </Modal>
  );
}
