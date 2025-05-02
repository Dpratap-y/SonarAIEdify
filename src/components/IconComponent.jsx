"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react'
import PropTypes from 'prop-types';

export default function IconComponent({ name, className }) {
    const IconComponent = LucideIcons[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <IconComponent className={className} />;
}

// Add PropTypes validation
IconComponent.propTypes = {
    // name is required as it's critical for resolving the icon
    name: PropTypes.string.isRequired,
    // className is optional
    className: PropTypes.string
};
