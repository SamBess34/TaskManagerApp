import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect } from "react";
import { FlatList, Image, SectionList, Text, View } from "react-native";
import { Task, TaskListProps } from "../../app/types";
import { useLanguage } from "../../contexts/LanguageContext";
import TaskItem from "./TaskItem";

dayjs.extend(LocalizedFormat);
dayjs.extend(AdvancedFormat);

export default function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  groupByDay = false,
}: TaskListProps) {
  const { t, locale } = useLanguage();

  // updat dayjs locale when app language changes
  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const today = dayjs();
  const formattedDate = today.format(t("dateFormat"));

  // render empty state when there are no tasks
  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center p-4">
      <Image
        source={require("../../assets/images/empty-state.jpg")}
        className="w-64 h-64"
        resizeMode="contain"
      />

      <Text className="text-2xl font-bold text-gray-700 text-center mb-2">
        {t("completedAllTasks")}
      </Text>
      <Text className="text-lg text-gray-500 text-center mb-8">
        {t("enjoyRestOfDay")}
      </Text>
      <View className="mt-4 mb-16">
        <Text className="text-lg text-red-500 text-center">{t("share")}</Text>
      </View>
    </View>
  );

  // header component showing current date
  const ListHeader = () => (
    <View className="mb-4 mt-2">
      <Text className="text-base text-gray-500 ml-6">{formattedDate}</Text>
    </View>
  );

  // group tasks by date
  const prepareSections = () => {
    const groupedTasks: { [key: string]: Task[] } = {};

    tasks.forEach((task) => {
      if (!task.due_date) return;

      const dateKey = dayjs(task.due_date).format("YYYY-MM-DD");
      if (!groupedTasks[dateKey]) {
        groupedTasks[dateKey] = [];
      }
      groupedTasks[dateKey].push(task);
    });

    return Object.entries(groupedTasks)
      .map(([dateKey, dateTasks]) => {
        const date = dayjs(dateKey);
        const isToday = date.isSame(dayjs(), "day");
        const isTomorrow = date.isSame(dayjs().add(1, "day"), "day");
        const isLater = date.isAfter(dayjs().add(7, "day"));

        let headerText;
        if (isToday) {
          headerText = t("today");
        } else if (isTomorrow) {
          headerText = t("tomorrow");
        } else if (!isLater) {
          const dayName = date.format("dddd");
          const capitalizedDay =
            dayName.charAt(0).toUpperCase() + dayName.slice(1);
          headerText = `${capitalizedDay} ${date.format("D MMMM")}`;
        } else {
          headerText = date.format("D MMMM YYYY");
        }

        return {
          title: headerText,
          data: dateTasks,
          dateKey,
        };
      })
      .sort((a, b) => (a.dateKey > b.dateKey ? 1 : -1));
  };

  // render section headers with date information
  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View className="bg-gray-100 py-2 px-6 mb-2">
      <Text className="text-base font-medium text-gray-800">
        {section.title}
      </Text>
    </View>
  );

  if (tasks.length === 0) {
    return renderEmptyList();
  }

  if (groupByDay) {
    return (
      <SectionList
        className="flex-1"
        sections={prepareSections()}
        keyExtractor={(item: Task) => item.id}
        renderItem={({ item }: { item: Task }) => (
          <TaskItem
            task={item}
            onToggleComplete={() => onToggleComplete(item.id)}
            onDelete={() => onDeleteTask(item.id)}
          />
        )}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    );
  }

  return (
    <FlatList
      className="flex-1"
      data={tasks}
      keyExtractor={(item: { id: string }) => item.id}
      ListHeaderComponent={ListHeader}
      renderItem={({ item }: { item: Task }) => (
        <TaskItem
          task={item}
          onToggleComplete={() => onToggleComplete(item.id)}
          onDelete={() => onDeleteTask(item.id)}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
}
