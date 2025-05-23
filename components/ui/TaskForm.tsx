import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { TaskFormProps } from "../../app/types";
import { useLanguage } from "../../contexts/LanguageContext";

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

  // reset all form fields
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(null);
    setLoading(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  // handle task submission and validation
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

  // handle date selection and updates the due date
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

  // handle time selection and updates the due date with selected time
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);

    if (selectedTime && dueDate) {
      const updatedDate = new Date(dueDate);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());

      setDueDate(updatedDate);
    }
  };

  // format the due date for display based on locale
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

  // render iOS specific date picker with custom controls
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

  // render iOS specific time picker with custom controls
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
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <View className="bg-white rounded-t-xl">
          <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
            <Text className="text-xl font-bold text-gray-800">
              {t("addTask")}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#444" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={20}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="px-6 pt-2 pb-6">
                <TextInput
                  className="text-xl font-normal text-black mb-4 pb-2 border-b border-gray-200"
                  placeholder={t("taskTitlePlaceholder")}
                  placeholderTextColor="#999"
                  value={title}
                  onChangeText={setTitle}
                  autoFocus
                />

                <TextInput
                  className="text-base text-gray-600 mb-6 min-h-12"
                  placeholder={t("descriptionPlaceholder")}
                  placeholderTextColor="#999"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                />

                <View className="flex-row mb-6 space-x-2 flex-wrap">
                  <TouchableOpacity
                    className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-2"
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={dueDate ? "#3a7f57" : "#777"}
                    />
                    <Text className="ml-2 text-gray-800 font-medium">
                      {getDateButtonText()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 mb-2">
                    <Ionicons name="alarm-outline" size={20} color="#777" />
                    <Text className="ml-2 text-gray-800 font-medium">
                      {t("reminder")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between mb-2">
                  <TouchableOpacity className="flex-row items-center">
                    <Ionicons name="folder-outline" size={20} color="#777" />
                    <Text className="ml-2 text-gray-800">{t("inbox")}</Text>
                    <Ionicons
                      name="chevron-down"
                      size={16}
                      color="#777"
                      className="ml-1"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-red-500 p-3 rounded-full shadow-sm flex items-center justify-center"
                    style={{
                      backgroundColor: "#dc4d3d",
                      width: 45,
                      height: 45,
                    }}
                    onPress={handleSubmit}
                    disabled={loading || !title.trim()}
                    activeOpacity={0.7}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Ionicons name="send" size={20} color="#ffffff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </View>

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
