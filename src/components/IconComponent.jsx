"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react'

export default function IconComponent({ name, className }) {
    const IconComponent = LucideIcons[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <IconComponent className={className} />;
}
