'use client';

import { useEffect } from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  useController
} from 'react-hook-form';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/form';
import { cn } from '@/lib/utils';
import Bold from '@tiptap/extension-bold';
import Paragraph from '@tiptap/extension-paragraph';

type RichTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
};

export default function RichTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  required = false,
  disabled = false,
  readOnly = false
}: RichTextFieldProps<T>) {
  const { field, fieldState } = useController({
    control,
    name,
    rules: { required }
  });

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link, Image, Bold, Paragraph],
    content: field.value || '',
    editable: !disabled && !readOnly,
    editorProps: {
      attributes: {
        class: 'outline-none'
      }
    },
    immediatelyRender: false,
    onUpdate({ editor }) {
      field.onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && field.value !== editor.getHTML()) {
      editor.commands.setContent(field.value || '');
    }
  }, [field.value, editor]);

  if (!editor) return null; // tránh SSR lỗi

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className='font-medium'>
          {label} {required && <span className='text-destructive'>*</span>}
        </label>
      )}

      <div
        className={cn(
          'focus-within:border-dodger-blue min-h-[120px] rounded border p-2',
          {
            'border-red-500': fieldState.invalid,
            'cursor-not-allowed opacity-50': disabled || readOnly
          }
        )}
      >
        {/* Toolbar */}
        <div className='mb-2 flex gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive('bold') ? 'bg-dodger-blue text-white' : ''
            }
          >
            B
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive('italic') ? 'bg-dodger-blue text-white' : ''
            }
          >
            I
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor.isActive('underline') ? 'bg-dodger-blue text-white' : ''
            }
          >
            U
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editor.isActive('strike') ? 'bg-dodger-blue text-white' : ''
            }
          >
            S
          </Button>
        </div>

        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {fieldState.invalid && required && (
        <span className='mt-1 text-sm text-red-500'>
          Trường này là bắt buộc
        </span>
      )}
    </div>
  );
}
