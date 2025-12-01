'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  Breadcrumb,
  Upload,
} from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import axios, { type AxiosError } from 'axios';
import { ToastContainer, toast, type Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { HomeOutlined, TagsOutlined, UploadOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import moment from "moment";
import { JSX } from '@emotion/react/jsx-runtime';
import { apiUrl } from '@/config';


interface Category {
  Categories_id: number;
  Category_name: string;
}

interface Subcategory {
  iSubCategoryId: number;
  strSubCategoryName: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface FormValues {
  code: string;
  dis_per: number | string;
  description: string;
  date_range: [moment.Moment, moment.Moment] | null;
  category_id: number;
  subcategory_id: number;
  link: string;
  pro_img?: File;
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }

    return this.props.children;
  }
}

const { Option } = Select;
const { RangePicker } = DatePicker;

function AddPromocode(): JSX.Element {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const response = await axios.get<ApiResponse<Category[]>>(
          `${apiUrl}/categories`
        );
        if (response.data.success && response.data.data) {
          setCategories(response.data.data);
        } else {
          toast.error('Failed to load categories');
        }
      } catch (error) {
        toast.error('An error occurred while fetching categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  const handleCategoryChange = useCallback(async (categoryId: number): Promise<void> => {
    try {
      const response = await axios.post<ApiResponse<Subcategory[]>>(
        `${apiUrl}/subcategories`,
        { Categories_id: categoryId }
      );
      if (response.data.success && response.data.data?.length) {
        setSubcategories(response.data.data);
      } else {
        setSubcategories([]);
        toast.error('No subcategories found for this category');
      }
    } catch (error) {
      toast.error('An error occurred while fetching subcategories');
      setSubcategories([]);
    }
  }, []);

  const onFinish = async (values: FormValues): Promise<void> => {
    setLoading(true);
    try {
      const vendorId = localStorage.getItem('vendor_id');
      if (!vendorId) {
        toast.error('Vendor ID not found in local storage.');
        setLoading(false);
        return;
      }

      const [start_date, end_date] = (values.date_range || []).map((date) =>
        date.format('DD-MM-YYYY')
      );

      const payload = new FormData();
      payload.append('code', values.code);
      payload.append('dis_per', String(values.dis_per));
      payload.append('description', values.description);
      payload.append('start_date', start_date);
      payload.append('end_date', end_date);
      payload.append('category_id', String(values.category_id));
      payload.append('subcategory_id', String(values.subcategory_id));
      payload.append('vendorid', vendorId);
      payload.append('link', values.link);
      
      if (fileList[0]?.originFileObj) {
        payload.append('pro_img', fileList[0].originFileObj);
      }

      const token = localStorage.getItem('token');

      const response = await axios.post<ApiResponse<any>>(
        `${apiUrl}/Front/PromocodeAdd`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Promocode created successfully');
        form.resetFields();
        setFileList([]);
        setSubcategories([]);
      } else {
        toast.error('Failed to create promocode.');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || 
        'An error occurred while creating the promocode.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = useCallback(({ fileList: newFileList }: UploadChangeParam<UploadFile>): void => {
    setFileList(newFileList.slice(-1)); // Keep only the latest file
  }, []);

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <Breadcrumb.Item>
            <Link href="/reseller/dashboard/reseller_dashboard">
              <HomeOutlined className="mx-1" />
              Dashboard
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/reseller/dashboard/add_promocode">
              <TagsOutlined className="mx-1" />
              Add Promo Code
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            <h2 className="add-promocode-head">Add Promocode</h2>
            <Form<FormValues>
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ dis_per: '' }}
              className="row"
            >
              <div className="col-lg-6">
                <Form.Item
                  name="code"
                  label="Promocode"
                  rules={[{ required: true, message: 'Please enter a promocode' }]}
                >
                  <Input placeholder="Enter promocode" />
                </Form.Item>
              </div>

              <div className="col-lg-6">
                <Form.Item
                  name="dis_per"
                  label="Discount Percentage"
                  rules={[
                    { required: true, message: 'Please enter discount percentage' },
                  ]}
                >
                  <Input type="number" placeholder="Enter discount percentage" />
                </Form.Item>
              </div>

              <div className="col-lg-12">
                <Form.Item
                  name="description"
                  label="Promocode Description"
                  rules={[{ required: true, message: 'Please enter Promocode Description' }]}
                >
                  <Input placeholder="Enter Promocode Description" />
                </Form.Item>
              </div>

              <div className="col-lg-12">
                <Form.Item
                  name="date_range"
                  className="w-100"
                  label="Validity Period"
                  rules={[{ required: true, message: 'Please select a date range' }]}
                >
                  <RangePicker className="w-100" format="DD-MM-YYYY" />
                </Form.Item>
              </div>

              <div className="col-lg-6">
                <Form.Item
                  name="category_id"
                  label="Category"
                  rules={[{ required: true, message: 'Please select a category' }]}
                >
                  <Select
                    placeholder="Select category"
                    onChange={handleCategoryChange}
                  >
                    {categories.map((category) => (
                      <Option
                        key={category.Categories_id}
                        value={category.Categories_id}
                      >
                        {category.Category_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="col-lg-6">
                <Form.Item
                  name="subcategory_id"
                  label="Subcategory"
                  rules={[{ required: true, message: 'Please select a subcategory' }]}
                >
                  <Select placeholder="Select subcategory">
                    {subcategories.map((subcategory) => (
                      <Option
                        key={subcategory.iSubCategoryId}
                        value={subcategory.iSubCategoryId}
                      >
                        {subcategory.strSubCategoryName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="col-lg-12">
                <Form.Item
                  name="link"
                  label="Link"
                  rules={[{ required: true, message: 'Please enter a link' }]}
                >
                  <Input placeholder="Enter link (e.g., www.example.com)" />
                </Form.Item>
              </div>

              <div className="col-lg-12">
                <Form.Item
                  name="pro_img"
                  label="Upload Image"
                  rules={[{ required: true, message: 'Please upload an image' }]}
                >
                  <Upload
                    listType="picture"
                    fileList={fileList}
                    onChange={handleFileChange}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  className="main-btn"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default AddPromocode;
