"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ForwardedRef, PropsWithChildren, ReactNode } from "react";
import React from "react";
import type { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { FormProvider, useController, useFormContext } from "react-hook-form";

import type { LabelProps } from "@/components/ui/label";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Checkbox } from "./checkbox.tsx";
import Conditional from "../utils/conditional.tsx";

const Form = FormProvider;

export interface SelectOptions {
  label: string | null;
  value: string;
}

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName>,
    PropsWithChildren {
  label: ReactNode;
  description?: ReactNode;
  message?: boolean;
  className?: string;
  options?: SelectOptions[];
  withAsterisk?: boolean;

  // RestProps
  labelProps?: LabelProps;
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
  messageProps?: React.HTMLAttributes<HTMLParagraphElement>;
}

const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  className,
  children,
  withAsterisk,
  ...props
}: FormInputProps<TFieldValues, TName>) => {
  const {
    name,
    control,
    rules,
    shouldUnregister,
    label,
    labelProps,
    description,
    descriptionProps,
    message = true,
    messageProps,
    ...restProps
  } = props;

  const id = React.useId();
  const { field, formState } = useController({
    name,
    control,
    rules,
    shouldUnregister,
  });
  const { getFieldState } = useFormContext();

  const { error } = getFieldState(name, formState);

  const formLabelId = `${id}-form-label`;
  const formDescriptionId = `${id}-form-item-description`;
  const formMessageId = `${id}-form-item-message`;

  const body = error ? String(error?.message) : null;

  return (
    <div className={cn("", className)} id={id} {...restProps}>
      <Label
        className={cn("ml-0.5 flex gap-[1px] items-center mb-1", error && "text-destructive", labelProps?.className)}
        htmlFor={formLabelId}
        {...labelProps}
      >
        <p>{label}</p>
        <Conditional satisfies={withAsterisk}>
          <span className="text-destructive">*</span>
        </Conditional>
      </Label>

      <Slot
        id={formLabelId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...field}
      >
        {children}
      </Slot>

      <Conditional satisfies={description && !body}>
        <p
          id={formDescriptionId}
          className={cn("ml-0.5 text-xs text-muted-foreground mt-0.5", descriptionProps?.className)}
          {...descriptionProps}
        >
          {description}
        </p>
        <Conditional satisfies={message && body}>
          <p
            id={formMessageId}
            className={cn("ml-0.5 text-xs font-medium text-destructive mt-0.5", messageProps?.className)}
            {...messageProps}
          >
            {body}
          </p>
        </Conditional>
      </Conditional>
    </div>
  );
};

FormInput.displayName = "FormInput";

const ToggleInput = React.forwardRef(
  <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
    { className, children, ...props }: FormInputProps<TFieldValues, TName>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      name,
      control,
      rules,
      shouldUnregister,
      label,
      labelProps,
      description,
      descriptionProps,
      message = true,
      messageProps,
      ...restProps
    } = props;

    const id = React.useId();
    const { field, formState } = useController({
      name,
      control,
      rules,
      shouldUnregister,
    });
    const { getFieldState } = useFormContext();

    const { error } = getFieldState(name, formState);

    const formLabelId = `${id}-form-label`;
    const formDescriptionId = `${id}-form-item-description`;
    const formMessageId = `${id}-form-item-message`;

    const body = error ? String(error?.message) : null;

    return (
      <div ref={ref} className={cn("mb-4 flex items-start gap-2", className)} id={id} {...restProps}>
        <Slot
          id={formLabelId}
          aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
          aria-invalid={!!error}
          aria-checked={field.value}
          {...field}
          // @ts-ignore - //! Find Solution why checked and onCheckedChange does not exists on Slot
          checked={field.value}
          onCheckedChange={field.onChange}
        >
          {children}
        </Slot>

        <div className="space-y-1 leading-none">
          <Label
            className={cn(error && "text-destructive", labelProps?.className)}
            htmlFor={formLabelId}
            {...labelProps}
          >
            {label}
          </Label>

          <Conditional satisfies={description && !body}>
            <p
              id={formDescriptionId}
              className={cn("text-xs text-muted-foreground", descriptionProps?.className)}
              {...descriptionProps}
            >
              {description}
            </p>
            <Conditional satisfies={message && body}>
              <p
                id={formMessageId}
                className={cn("text-xs font-medium text-destructive", messageProps?.className)}
                {...messageProps}
              >
                {body}
              </p>
            </Conditional>
          </Conditional>
        </div>
      </div>
    );
  }
);

ToggleInput.displayName = ToggleInput.name;

const CheckboxGroup = React.forwardRef(
  <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
    { className, ...props }: FormInputProps<TFieldValues, TName>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      name,
      control,
      rules,
      shouldUnregister,
      label,
      labelProps,
      description,
      descriptionProps,
      message = true,
      messageProps,
      options = [],
      ...restProps
    } = props;

    const id = React.useId();
    const { field, formState } = useController({
      name,
      control,
      rules,
      shouldUnregister,
    });
    const { getFieldState } = useFormContext();

    const { error } = getFieldState(name, formState);

    const formLabelId = `${id}-form-label`;
    const formDescriptionId = `${id}-form-item-description`;
    const formMessageId = `${id}-form-item-message`;

    const body = error ? String(error?.message) : null;

    return (
      <div ref={ref} className={cn("mb-4 flex flex-col gap-2", className)} id={id} {...restProps}>
        <Label className={cn(error && "text-destructive", labelProps?.className)} htmlFor={formLabelId} {...labelProps}>
          {label}
        </Label>

        <Conditional satisfies={description && !body}>
          <p
            id={formDescriptionId}
            className={cn("text-xs text-muted-foreground", descriptionProps?.className)}
            {...descriptionProps}
          >
            {description}
          </p>
        </Conditional>
        {options?.map((item) => {
          return (
            <div key={item.value} className="flex items-center gap-2">
              <Checkbox
                checked={field.value?.includes(item.value)}
                onCheckedChange={(checked) =>
                  checked
                    ? field.onChange([...field.value, item.value])
                    : field.onChange(field.value?.filter((value: string) => value !== item.value))
                }
              />
              <Label
                className={cn(error && "text-destructive", labelProps?.className)}
                htmlFor={formLabelId}
                {...labelProps}
              >
                {item.label}
              </Label>
            </div>
          );
        })}

        {/* <Slot
          id={formLabelId}
          aria-describedby={
            !error
              ? `${formDescriptionId}`
              : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          aria-checked={field.value}
          {...field}
        >
          {children}
        </Slot> */}

        <Conditional satisfies={message && body}>
          <p
            id={formMessageId}
            className={cn("text-xs font-medium text-destructive", messageProps?.className)}
            {...messageProps}
          >
            {body}
          </p>
        </Conditional>
      </div>
    );
  }
);

CheckboxGroup.displayName = CheckboxGroup.name;

export { CheckboxGroup, Form, FormInput, ToggleInput };
