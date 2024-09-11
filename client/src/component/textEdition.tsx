import React from 'react'
import { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import './textEdition.css';
import { Button, Select, Space } from 'antd';
import {
  OrderedListOutlined,
  UnorderedListOutlined,
  UnderlineOutlined,
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import debounce from 'lodash.debounce';
interface Props {
  onChange: (content: string) => void;
  value?: string;
}

const TextEdition: React.FC<Props> = ({ onChange, value,  }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],

    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const valueRef = useRef(value);

  // Debounced function to avoid frequent updates
  const debouncedSetContent = useRef(
    debounce((content: string) => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, 300),
  ).current;

  useEffect(() => {
    if (editor && value !== valueRef.current) {
      valueRef.current = value;
      debouncedSetContent(value || '');
    }
  }, [value, editor, debouncedSetContent]);

  // Если editor не инициализирован, не рендерим компонент
  if (!editor) return null;

  return (
    <div>
      <div className="toolbar">
        <Space>
          <Select
            defaultValue={0}
            onChange={(e: 0 | 1 | 2 | 3 | 4 | 5 | 6) =>
              e !== 0
                ? editor.chain().focus().toggleHeading({ level: e }).run()
                : editor.chain().focus().setParagraph().run()
            }
          >
            <Select.Option value={0}>Обычный</Select.Option>
            <Select.Option value={1}>H1</Select.Option>
            <Select.Option value={2}>H2</Select.Option>
            <Select.Option value={3}>H3</Select.Option>
            <Select.Option value={4}>H4</Select.Option>
            <Select.Option value={5}>H5</Select.Option>
            <Select.Option value={6}>H6</Select.Option>
          </Select>
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon={<BoldOutlined />}
            className={editor.isActive('bold') ? 'is-active' : ''}
          />
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon={<ItalicOutlined />}
            className={editor.isActive('italic') ? 'is-active' : ''}
          />
          <Button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            icon={<UnderlineOutlined />}
            className={editor.isActive('underline') ? 'is-active' : ''}
          />
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={<UnorderedListOutlined />}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          />
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<OrderedListOutlined />}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
          />
          <Button
            onClick={() => {
              const url = prompt('Enter URL');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            icon={<LinkOutlined />}
            className={editor.isActive('link') ? 'is-active' : ''}
          />
        </Space>
      </div>
      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEdition;
