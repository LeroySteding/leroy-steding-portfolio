import type { Meta, StoryObj } from '@storybook/react';
import { Input, TextArea, Select, Checkbox, Radio, RadioGroup } from '@steding/ui';
import { useState } from 'react';

/**
 * Form Components
 * 
 * Comprehensive collection of form input components with validation, 
 * accessibility, and theming support.
 * 
 * ## Components Included
 * - **Input**: Text input with icons, variants, validation
 * - **TextArea**: Multi-line text input with character count
 * - **Select**: Dropdown select with custom options
 * - **Checkbox**: Checkbox with labels and indeterminate state
 * - **Radio**: Radio buttons with group support
 * 
 * ## Features
 * - ✅ Full accessibility (ARIA labels, keyboard navigation)
 * - ✅ Validation and error states
 * - ✅ Multiple size variants (sm, md, lg)
 * - ✅ Multiple visual variants (default, filled, outlined)
 * - ✅ Icon support
 * - ✅ Helper text and labels
 * - ✅ Required field indicators
 * - ✅ Disabled states
 */
const meta = {
  title: 'Components/Form Components',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Input - All Variants
 * 
 * Text input component with multiple variants and sizes.
 */
export const InputVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-text-primary">Input Variants</h3>
        
        <Input
          label="Default Input"
          placeholder="Enter your name"
          helperText="This is a helper text"
        />

        <Input
          variant="filled"
          label="Filled Input"
          placeholder="Enter email"
        />

        <Input
          variant="outlined"
          label="Outlined Input"
          placeholder="Enter password"
          type="password"
        />

        <Input
          label="With Error"
          placeholder="Enter value"
          error="This field is required"
        />

        <Input
          label="Disabled"
          placeholder="Disabled input"
          disabled
        />
      </div>
    </div>
  ),
};

/**
 * Input - With Icons
 * 
 * Input with left and right icons.
 */
export const InputWithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <Input
        label="Search"
        placeholder="Search..."
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        rightIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        }
      />
    </div>
  ),
};

/**
 * Input - Sizes
 * 
 * Different size variants.
 */
export const InputSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
};

/**
 * TextArea - All Variants
 * 
 * Multi-line text input with character count.
 */
export const TextAreaVariants: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    return (
      <div className="space-y-4">
        <TextArea
          label="Message"
          placeholder="Enter your message"
          helperText="Write a detailed message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <TextArea
          variant="filled"
          label="Description"
          placeholder="Enter description"
          maxLength={200}
          showCount
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <TextArea
          label="With Error"
          error="Message is too short"
          placeholder="Enter value"
        />

        <TextArea
          label="Disabled"
          placeholder="Disabled textarea"
          disabled
        />
      </div>
    );
  },
};

/**
 * Select - All Variants
 * 
 * Dropdown select with custom options.
 */
export const SelectVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Select
        label="Country"
        placeholder="Select a country"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' },
          { value: 'au', label: 'Australia' },
        ]}
      />

      <Select
        variant="filled"
        label="Priority"
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent', disabled: true },
        ]}
      />

      <Select
        label="With Error"
        error="Please select an option"
        options={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ]}
      />
    </div>
  ),
};

/**
 * Checkbox - All Variants
 * 
 * Checkbox with labels and states.
 */
export const CheckboxVariants: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    const [indeterminate, setIndeterminate] = useState(true);
    
    return (
      <div className="space-y-4">
        <Checkbox label="Accept terms and conditions" />

        <Checkbox
          label="Subscribe to newsletter"
          description="Get updates on new features and releases"
        />

        <Checkbox
          label="Controlled Checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />

        <Checkbox
          label="Indeterminate State"
          indeterminate={indeterminate}
          onChange={(e) => {
            setIndeterminate(false);
            setChecked(e.target.checked);
          }}
        />

        <Checkbox
          label="With Error"
          error="You must accept to continue"
        />

        <Checkbox
          label="Disabled"
          disabled
        />
      </div>
    );
  },
};

/**
 * Radio - Group
 * 
 * Radio buttons with group support.
 */
export const RadioGroupExample: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    
    return (
      <div className="space-y-6">
        <RadioGroup
          label="Choose an option"
          name="options"
          value={value}
          onChange={setValue}
          options={[
            { value: 'option1', label: 'Option 1', description: 'This is the first option' },
            { value: 'option2', label: 'Option 2', description: 'This is the second option' },
            { value: 'option3', label: 'Option 3', description: 'This is the third option' },
          ]}
        />

        <RadioGroup
          label="Horizontal Radio Group"
          name="horizontal"
          orientation="horizontal"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'maybe', label: 'Maybe' },
          ]}
        />

        <RadioGroup
          label="With Disabled Option"
          name="disabled"
          options={[
            { value: 'available', label: 'Available' },
            { value: 'unavailable', label: 'Unavailable', disabled: true },
          ]}
        />
      </div>
    );
  },
};

/**
 * Complete Form Example
 * 
 * Full form with all components together.
 */
export const CompleteForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      country: '',
      message: '',
      newsletter: false,
      priority: '',
    });

    return (
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6 card p-8">
          <h2 className="text-3xl font-black text-text-primary mb-6">Contact Form</h2>

          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Select
            label="Country"
            placeholder="Select your country"
            required
            options={[
              { value: 'us', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'ca', label: 'Canada' },
              { value: 'nl', label: 'Netherlands' },
            ]}
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />

          <RadioGroup
            label="Priority Level"
            name="priority"
            value={formData.priority}
            onChange={(value) => setFormData({ ...formData, priority: value })}
            options={[
              { value: 'low', label: 'Low', description: 'General inquiry' },
              { value: 'high', label: 'High', description: 'Urgent matter' },
            ]}
          />

          <TextArea
            label="Message"
            placeholder="Tell us more..."
            required
            maxLength={500}
            showCount
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <Checkbox
            label="Subscribe to newsletter"
            description="Receive updates and news"
            checked={formData.newsletter}
            onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
          />

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-accent-primary text-primary-bg font-bold hover:bg-accent-hover transition-colors"
          >
            Submit Form
          </button>
        </form>
      </div>
    );
  },
};
