"use client";

import { useState } from "react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="bg-[#1a1a1a] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="section-label mb-4 block">Cooperation</span>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">渠道合作</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            期待与您建立长期稳定的合作关系
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">联系方式</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <span className="text-[#d4af37]">商务热线</span>
                  <br />
                  400-888-金锤（示例）
                </li>
                <li>
                  <span className="text-[#d4af37]">电子邮箱</span>
                  <br />
                  channel@goldenhammer.wine
                </li>
                <li>
                  <span className="text-[#d4af37]">总部地址</span>
                  <br />
                  中国 · 渠道合作中心
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">合作类型</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• 经销商合作 · 区域代理</li>
                <li>• 商超渠道 · 连锁入驻</li>
                <li>• 电商合作 · 平台分销</li>
                <li>• 团购定制 · 企业礼赠</li>
              </ul>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] p-8"
          >
            {submitted ? (
              <div className="py-12 text-center">
                <p className="text-lg text-[#d4af37]">感谢您的咨询！</p>
                <p className="mt-2 text-gray-500">我们将尽快与您联系</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="联系人 *" name="name" required />
                  <Field label="公司" name="company" />
                </div>
                <div className="mt-4">
                  <Field label="联系电话 *" name="phone" required />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-400">
                    合作类型
                  </label>
                  <select
                    name="type"
                    className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-white outline-none focus:border-[#d4af37]"
                    defaultValue="dealer"
                  >
                    <option value="dealer">经销商合作</option>
                    <option value="retail">商超渠道</option>
                    <option value="online">电商合作</option>
                    <option value="group">团购定制</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-400">留言</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-lg bg-[#d4af37] py-3 font-semibold text-[#1a1a1a] transition hover:bg-[#e8c547]"
                >
                  提交咨询
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <input
        name={name}
        required={required}
        className="mt-1 w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-white outline-none focus:border-[#d4af37]"
      />
    </div>
  );
}
