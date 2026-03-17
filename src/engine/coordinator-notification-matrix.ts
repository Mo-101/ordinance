/**
 * Coordinator Notification Matrix
 * Defines all events and who gets notified when
 */

import { NotificationEvent } from './order-state-machine.v2';

export interface NotificationRule {
  event: string;
  recipients: {
    type: 'country' | 'coordinator' | 'osl_ops' | 'warehouse' | 'chief' | 'system';
    userId?: string; // If specific user
    channel: 'in_app' | 'email' | 'sms' | 'webhook';
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    template: {
      subject: string;
      body: string;
      inAppLabel?: string;
    };
  }[];
}

export const NOTIFICATION_RULES: NotificationRule[] = [
  {
    event: 'ORDER_CREATED',
    recipients: [
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Draft order created',
          body: 'Your draft order has been saved. You can submit it when ready.',
          inAppLabel: 'Draft saved',
        },
      },
    ],
  },

  {
    event: 'ORDER_SUBMITTED',
    recipients: [
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'New order submitted',
          body: 'Order {orderNumber} requires coordination review.',
          inAppLabel: 'New submission',
        },
      },
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Order submitted',
          body: 'Your order has been submitted for coordination review.',
          inAppLabel: 'Submitted',
        },
      },
    ],
  },

  {
    event: 'COORDINATION_EXCEPTION',
    recipients: [
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'high',
        template: {
          subject: 'Coordination exception raised',
          body: 'Your order has exceptions that need your attention. Please review and respond.',
          inAppLabel: 'Action required',
        },
      },
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Exception raised',
          body: 'Exception raised on order {orderNumber}. Awaiting country response.',
          inAppLabel: 'Exception raised',
        },
      },
    ],
  },

  {
    event: 'COORDINATION_RESOLVED',
    recipients: [
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Coordination resolved',
          body: 'All exceptions resolved for order {orderNumber}. Proceeding to sourcing.',
          inAppLabel: 'Coordination resolved',
        },
      },
    ],
  },

  {
    event: 'SOURCING_OPTIONS_GENERATED',
    recipients: [
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Sourcing options available',
          body: 'Sourcing options have been generated for your order. Please review and respond.',
          inAppLabel: 'Options ready',
        },
      },
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Options sent to country',
          body: 'Sourcing options sent to country for order {orderNumber}.',
          inAppLabel: 'Options sent',
        },
      },
    ],
  },

  {
    event: 'COUNTRY_ACCEPTED_OPTION',
    recipients: [
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Country accepted option',
          body: 'Country accepted sourcing option for order {orderNumber}. Ready for SR generation.',
          inAppLabel: 'Option accepted',
        },
      },
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Option accepted',
          body: 'Country accepted option for order {orderNumber}.',
          inAppLabel: 'Option accepted',
        },
      },
    ],
  },

  {
    event: 'COUNTRY_REJECTED_OPTION',
    recipients: [
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'high',
        template: {
          subject: 'Option rejected',
          body: 'Country rejected sourcing option for order {orderNumber}. Review feedback and regenerate.',
          inAppLabel: 'Option rejected',
        },
      },
    ],
  },

  {
    event: 'COUNTRY_REQUESTED_ALTERNATIVE',
    recipients: [
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'high',
        template: {
          subject: 'Alternative requested',
          body: 'Country requested alternative options for order {orderNumber}.',
          inAppLabel: 'Alternative requested',
        },
      },
    ],
  },

  {
    event: 'SR_GENERATED',
    recipients: [
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Stock Requisition generated',
          body: 'SR generated for order {orderNumber}. Please review and process.',
          inAppLabel: 'SR generated',
        },
      },
      {
        type: 'warehouse',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Stock Requisition',
          body: 'New SR generated for order {orderNumber}. Prepare stock for reservation.',
          inAppLabel: 'New SR',
        },
      },
    ],
  },

  {
    event: 'STOCK_RESERVED',
    recipients: [
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Stock reserved',
          body: 'Stock has been reserved for your order.',
          inAppLabel: 'Stock reserved',
        },
      },
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Stock reserved',
          body: 'Stock reserved for order {orderNumber}.',
          inAppLabel: 'Stock reserved',
        },
      },
    ],
  },

  {
    event: 'STOCK_RELEASED',
    recipients: [
      {
        type: 'warehouse',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Stock released',
          body: 'Stock released for order {orderNumber}. Prepare for dispatch.',
          inAppLabel: 'Stock released',
        },
      },
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Stock released',
          body: 'Stock released for order {orderNumber}. Ready for dispatch.',
          inAppLabel: 'Stock released',
        },
      },
    ],
  },

  {
    event: 'DISPATCHED',
    recipients: [
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Order dispatched',
          body: 'Your order has been dispatched. AWB: {awbNumber}',
          inAppLabel: 'Dispatched',
        },
      },
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Order dispatched',
          body: 'Order {orderNumber} dispatched.',
          inAppLabel: 'Dispatched',
        },
      },
    ],
  },

  {
    event: 'DELIVERED',
    recipients: [
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Order delivered',
          body: 'Your order has been delivered successfully.',
          inAppLabel: 'Delivered',
        },
      },
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'low',
        template: {
          subject: 'Order delivered',
          body: 'Order {orderNumber} delivered.',
          inAppLabel: 'Delivered',
        },
      },
    ],
  },

  {
    event: 'ORDER_CANCELLED',
    recipients: [
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Order cancelled',
          body: 'Your order has been cancelled.',
          inAppLabel: 'Cancelled',
        },
      },
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Order cancelled',
          body: 'Order {orderNumber} cancelled.',
          inAppLabel: 'Cancelled',
        },
      },
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Order cancelled',
          body: 'Order {orderNumber} cancelled.',
          inAppLabel: 'Cancelled',
        },
      },
    ],
  },

  {
    event: 'ORDER_REJECTED',
    recipients: [
      {
        type: 'country',
        channel: 'in_app',
        urgency: 'high',
        template: {
          subject: 'Order rejected',
          body: 'Your order has been rejected. Reason: {reason}',
          inAppLabel: 'Rejected',
        },
      },
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'medium',
        template: {
          subject: 'Order rejected',
          body: 'Order {orderNumber} rejected.',
          inAppLabel: 'Rejected',
        },
      },
    ],
  },

  {
    event: 'SLA_BREACH_WARNING',
    recipients: [
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'high',
        template: {
          subject: 'SLA breach warning',
          body: 'Order {orderNumber} is approaching SLA deadline for {stage}.',
          inAppLabel: 'SLA warning',
        },
      },
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'high',
        template: {
          subject: 'SLA breach warning',
          body: 'Order {orderNumber} approaching SLA deadline.',
          inAppLabel: 'SLA warning',
        },
      },
    ],
  },

  {
    event: 'SLA_BREACHED',
    recipients: [
      {
        type: 'chief',
        channel: 'in_app',
        urgency: 'urgent',
        template: {
          subject: 'SLA BREACHED',
          body: 'SLA breached for order {orderNumber} in stage {stage}. Immediate attention required.',
          inAppLabel: 'SLA BREACHED',
        },
      },
      {
        type: 'coordinator',
        channel: 'in_app',
        urgency: 'urgent',
        template: {
          subject: 'SLA BREACHED',
          body: 'SLA breached for order {orderNumber}.',
          inAppLabel: 'SLA BREACHED',
        },
      },
      {
        type: 'osl_ops',
        channel: 'in_app',
        urgency: 'urgent',
        template: {
          subject: 'SLA BREACHED',
          body: 'SLA breached for order {orderNumber}.',
          inAppLabel: 'SLA BREACHED',
        },
      },
    ],
  },
];

// NOTIFICATION ENGINE
export class NotificationEngine {
  static generateNotifications(
    event: string,
    orderId: string,
    orderNumber: string,
    actors: {
      country?: string;
      coordinator?: string;
      osl_ops?: string;
      warehouse?: string;
      chief?: string;
    },
    variables?: Record<string, string>
  ): NotificationEvent[] {
    const rule = NOTIFICATION_RULES.find(r => r.event === event);
    if (!rule) return [];

    const notifications: NotificationEvent[] = [];

    rule.recipients.forEach(recipient => {
      const userId = actors[recipient.type];
      if (!userId && recipient.type !== 'system') return; // Skip if no user ID for non-system

      const template = recipient.template;
      const body = this.interpolate(template.body, { orderNumber, ...variables });
      const subject = this.interpolate(template.subject, { orderNumber, ...variables });

      notifications.push({
        id: crypto.randomUUID(),
        orderId,
        event,
        recipientType: recipient.type,
        recipientUserId: userId,
        channel: recipient.channel,
        urgency: recipient.urgency,
        subject,
        body,
        inAppLabel: template.inAppLabel,
        delivered: false,
      });
    });

    return notifications;
  }

  private static interpolate(template: string, vars: Record<string, string>): string {
    return template.replace(/{(\w+)}/g, (match, key) => vars[key] || match);
  }

  static getEventsForRecipientType(recipientType: string): string[] {
    const events = new Set<string>();
    NOTIFICATION_RULES.forEach(rule => {
      if (rule.recipients.some(r => r.type === recipientType)) {
        events.add(rule.event);
      }
    });
    return Array.from(events);
  }

  static getUrgentEvents(): string[] {
    return NOTIFICATION_RULES
      .filter(rule => rule.recipients.some(r => r.urgency === 'urgent'))
      .map(rule => rule.event);
  }
}
