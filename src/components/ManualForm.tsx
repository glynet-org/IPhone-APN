import { Input, Tabs } from '@cloudflare/kumo';

export interface ManualValues {
  apn: string;
  username: string;
  password: string;
  authType: 'CHAP' | 'PAP';
  displayName: string;
}

export const EMPTY_MANUAL: ManualValues = { apn: '', username: '', password: '', authType: 'CHAP', displayName: '' };

/** Problems with the form, by field (empty when it can be downloaded). */
export function validateManual(values: ManualValues): Partial<Record<keyof ManualValues, string>> {
  const errors: Partial<Record<keyof ManualValues, string>> = {};
  if (!values.apn.trim()) errors.apn = 'نام APN را وارد کنید.';
  else if (!/^[A-Za-z0-9._-]{1,63}$/.test(values.apn.trim())) errors.apn = 'فقط حروف انگلیسی، عدد و . - _ (حداکثر ۶۳ کاراکتر).';
  return errors;
}

/** Your own APN settings, one field per line. IPv4 + IPv6 isn't a field: it is always on. */
export function ManualForm({ values, onChange, showErrors }: { values: ManualValues; onChange: (values: ManualValues) => void; showErrors: boolean }) {
  const errors = showErrors ? validateManual(values) : {};
  const set = (key: keyof ManualValues) => (event: { target: { value: string } }) => onChange({ ...values, [key]: event.target.value });
  const latin = { dir: 'ltr', autoCapitalize: 'none', autoCorrect: 'off', spellCheck: false, className: 'text-left' } as const;

  return (
    <div className="space-y-5">
      <Input label="نام APN" placeholder="mcinet" {...latin} value={values.apn} onChange={set('apn')} error={errors.apn} variant={errors.apn ? 'error' : 'default'} />
      <Input label="نام کاربری" description="اگر اپراتور نداده، خالی بگذارید." {...latin} value={values.username} onChange={set('username')} />
      <Input label="رمز عبور" description="اگر اپراتور نداده، خالی بگذارید." {...latin} type="password" value={values.password} onChange={set('password')} />
      {values.username && (
        <div>
          <div className="mb-2 text-sm font-medium text-kumo-default">نوع احراز هویت</div>
          <Tabs
            value={values.authType}
            onValueChange={(value) => onChange({ ...values, authType: value as ManualValues['authType'] })}
            tabs={[
              { value: 'CHAP', label: 'CHAP' },
              { value: 'PAP', label: 'PAP' },
            ]}
          />
        </div>
      )}
      <Input
        label="نام پروفایل"
        description="همان نامی که در تنظیمات آیفون دیده می‌شود."
        placeholder={`APN ${values.apn || '…'} – گلاینت`}
        value={values.displayName}
        onChange={set('displayName')}
      />
    </div>
  );
}
