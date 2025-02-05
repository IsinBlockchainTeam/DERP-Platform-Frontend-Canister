import {useState} from "react";
import FormLoader from "../../../../components/Loading/FormLoader";
import {useTranslation} from "react-i18next";
import {RegisterUserResponseDto} from "../../../../dto/auth/RegisterUserDto";
import {supplierService} from "../../../../api/services/Supplier";
import Card from "../../../../components/Card/Card";

export type Props = {
  onCompleted: (registered: RegisterUserResponseDto) => void;
}

export function SignupRegisterStep({
                                     onCompleted
                                   }: Props) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, isLoading] = useState(false);

  const {t} = useTranslation(undefined, {keyPrefix: 'adminDashboard.supplierRegistration'});

  const onSubmit = async () => {
    if (email === '') {
      setErrorMessage(t('errors.email'));
      return;
    }

    isLoading(true);
    try {
      const response = await supplierService.register(email);
      if (response) {
        setErrorMessage('');
        onCompleted(response);
      }
    } catch (e: unknown) {
      if((e as any).message)
        setErrorMessage((e as any).message);
      else
        setErrorMessage(JSON.stringify(e));
    }
  }

  return <main>
      <div className="h-screen flex flex-col items-center justify-center">
        <Card title={t('title')}>
          <div className="form-control">
            <div className={errorMessage ? 'alert alert-error shadow-lg mb-10' : 'hidden'}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>

              <form>
                <label className="label">
                  <span className="label-text font-bold text-primary">{t('email')}:</span>
                </label>
                <input
                    type="text" id="email" placeholder="Email"
                    className="input input-bordered w-full max-w-xs"
                    value={email}
                    onChange={e => setEmail(e.target.value)}/>

                <button className={`btn btn-primary mt-6 ${loading ? 'loading disabled' : ''}`} onClick={e => {
                  e.preventDefault();
                  onSubmit();
                }}>{t('submitBtn')}</button>
              </form>

              {
                  loading && <FormLoader/>
              }
            </div>
        </Card>
      </div>
  </main>
}
